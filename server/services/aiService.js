require('dotenv').config();  // Ensure dotenv loads GEMINI_API_KEY

const { GoogleGenAI } = require("@google/genai");

// Simple cache (in-memory, TTL 5 min)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;  // 5 minutes

// Utility function to validate and sanitize input
const validateSymptoms = (symptoms) => {
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
        throw new Error("Symptoms must be a non-empty array of strings");
    }
    let cleaned = symptoms.map(symptom => symptom.trim()).filter(symptom => symptom.length > 0);
    if (cleaned.length === 0) {
        throw new Error("No valid symptoms provided");
    }
    // Truncate total length to avoid prompt overflow
    const totalLength = cleaned.join(', ').length;
    if (totalLength > 100) {
        cleaned = cleaned.slice(0, 3);  // Limit to top 3 symptoms
        console.warn(`Prompt truncated: Original length ${totalLength}, now using top 3 symptoms`);
    }
    return cleaned;
};

// Utility to add disclaimer to responses
const addDisclaimer = (analysis) => {
    return {
        ...analysis,
        disclaimer: {
            en: "This is not a substitute for professional medical advice. Consult a doctor for diagnosis and treatment.",
            hi: "यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। निदान और उपचार के लिए डॉक्टर से परामर्श करें।"
        }
    };
};

// Retry utility for AI calls
const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            console.warn(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));  // Exponential backoff
        }
    }
};

class AIService {
    constructor() {
        this.ai = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        const timestamp = new Date().toISOString();
        // Check for GEMINI_API_KEY (recommended by docs)
        if (process.env.GEMINI_API_KEY) {
            try {
                // Docs way: Empty object – auto-picks from GEMINI_API_KEY env
                this.ai = new GoogleGenAI({});
                this.isInitialized = true;
                console.log(`[${timestamp}] AI Service initialized successfully with GEMINI_API_KEY (using gemini-2.5-flash)`);
            } catch (error) {
                console.error(`[${timestamp}] Failed to initialize AI Service:`, error.message || error);
                this.isInitialized = false;
            }
        } else {
            // Fallback to old AI_API_KEY for backward compat (explicit string pass)
            if (process.env.AI_API_KEY) {
                try {
                    this.ai = new GoogleGenAI(process.env.AI_API_KEY);  // Direct string as per some examples
                    this.isInitialized = true;
                    console.log(`[${timestamp}] AI Service initialized with explicit AI_API_KEY`);
                } catch (error) {
                    console.error(`[${timestamp}] Explicit init failed:`, error.message);
                    this.isInitialized = false;
                }
            } else {
                console.warn(`[${timestamp}] No API key found (check GEMINI_API_KEY or AI_API_KEY). Using fallback mode.`);
                this.isInitialized = false;
            }
        }
    }

    async generateAnalysis(symptoms) {
        const timestamp = new Date().toISOString();
        try {
            const validatedSymptoms = validateSymptoms(symptoms);
            const cacheKey = validatedSymptoms.join('|').toLowerCase();  // Simple key

            // Check cache
            const cached = cache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
                console.log(`[${timestamp}] Cache hit for: ${cacheKey}`);
                return cached.data;
            }

            const prompt = this._buildPrompt(validatedSymptoms);

            if (!this.isInitialized) {
                console.warn(`[${timestamp}] AI not available. Returning fallback analysis.`);
                const fallback = this._getFallbackAnalysis(validatedSymptoms);
                this._cacheResult(cacheKey, fallback);
                return fallback;
            }

            // AI call with retry
            const result = await withRetry(async () => {
                return await this.ai.models.generateContent({
                    model: "gemini-2.5-flash",  // Current stable model (2026)
                    contents: [{ role: "user", parts: [{ text: prompt }] }]
                });
            });

            if (!result || !result.candidates || result.candidates.length === 0) {
                throw new Error("Invalid response from AI: No candidates generated");
            }

            const text = result.candidates[0].content.parts[0].text;
            console.log(`[${timestamp}] AI Raw Response (first 200 chars):`, text.substring(0, 200) + '...');
            const parsed = this._parseResponse(text);
            const finalResult = parsed.map(condition => addDisclaimer(condition));

            // Cache the result
            this._cacheResult(cacheKey, finalResult);

            return finalResult;

        } catch (error) {
            console.error(`[${timestamp}] AI Generation Error:`, error.message);
            const fallback = this._getFallbackAnalysis(symptoms);
            // Don't cache fallbacks to encourage retries
            return fallback;
        }
    }

    _cacheResult(key, data) {
        cache.set(key, { data, timestamp: Date.now() });
        // Cleanup old entries (simple, runs on set)
        for (const [k, v] of cache.entries()) {
            if (Date.now() - v.timestamp > CACHE_TTL) {
                cache.delete(k);
            }
        }
    }

    _buildPrompt(symptoms) {
        return `
        You are a reliable medical assistant powered by AI. IMPORTANT: Only provide general information based on common symptoms. Do NOT diagnose or prescribe. Always prioritize user safety.

        User symptoms: "${symptoms.join(', ')}"

        Tasks:
        1. Identify UP TO 3 most likely common conditions (focus on everyday issues like cold, headache, indigestion – avoid rare diseases).
        2. For EACH condition:
           - Condition Name: Simple English name.
           - Condition Hindi: Accurate Hindi translation.
           - Severity: Low (मामूली), Medium (मध्यम), High (गंभीर), Critical (बहुत गंभीर) – base on symptom severity.
           - Severity Hindi: Hindi translation.
           - Description: Simplified explanation in English (like explaining to a 5-year-old) – max 50 words.
           - Description Hindi: Same in simple Hindi.
           - Advice: Practical home actions or when to seek help (English) – safe, evidence-based, max 50 words.
           - Advice Hindi: Same in Hindi.

        Response Rules:
        - Output ONLY a valid JSON array (no extra text, markdown, or explanations).
        - Ensure JSON is parseable and complete.
        - If symptoms are unclear, suggest consulting a doctor as first condition.

        Format:
        [
            {
                "condition": "Condition Name",
                "condition_hi": "बीमारी का नाम",
                "severity": "Low/Medium/High/Critical",
                "severity_hi": "मामूली/मध्यम/गंभीर/बहुत गंभीर",
                "description": "Simple English explanation.",
                "description_hi": "सरल हिंदी व्याख्या।",
                "advice": "Safe home advice.",
                "advice_hi": "सुरक्षित घरेलू सलाह।"
            }
        ]
        `;
    }

    _parseResponse(text) {
        const timestamp = new Date().toISOString();
        let jsonStr = text
            .replace(/```json|```/g, '')
            .replace(/^\s*[\w\s]*JSON\s*:\s*/i, '')
            .trim();

        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket > firstBracket) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        if (!jsonStr.startsWith('[') || !jsonStr.endsWith(']')) {
            console.error(`[${timestamp}] Invalid JSON structure: Not an array`);
            throw new Error("Invalid JSON structure: Not an array");
        }

        try {
            const parsed = JSON.parse(jsonStr);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                console.error(`[${timestamp}] Parsed response is not a valid non-empty array`);
                throw new Error("Parsed response is not a valid non-empty array");
            }
            return parsed.slice(0, 3);
        } catch (e) {
            console.error(`[${timestamp}] Parse failed. Raw text snippet:`, text.substring(0, 200));
            throw new Error("Invalid AI response format. Using fallback.");
        }
    }

    _getFallbackAnalysis(symptoms) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Generating fallback for symptoms: ${symptoms.join(', ')}`);
        
        let mockData = [
            {
                condition: "General Fatigue",
                condition_hi: "सामान्य थकान",
                severity: "Low",
                severity_hi: "मामूली",
                description: "Body feels tired, like after a long day of play.",
                description_hi: "शरीर थका हुआ लग रहा, जैसे लंबे दिन के खेल के बाद।",
                advice: "Rest, eat healthy, drink water. See doctor if lasts >1 week.",
                advice_hi: "आराम करें, स्वस्थ खाएं, पानी पिएं। अगर 1 हफ्ते से ज्यादा तो डॉक्टर जाएं।"
            }
        ];

        // Expanded symptom-based mock
        const lowerSymptoms = symptoms.map(s => s.toLowerCase());
        if (lowerSymptoms.some(s => s.includes('headache') || s.includes('सिरदर्द'))) {
            mockData.push({
                condition: "Mild Headache",
                condition_hi: "हल्का सिरदर्द",
                severity: "Low",
                severity_hi: "मामूली",
                description: "Head hurts a bit, maybe from too much screen or no water. Like a grumpy brain hug.",
                description_hi: "सिर थोड़ा दुख रहा, शायद स्क्रीन ज्यादा या पानी कम से। जैसे चिड़चिड़ा दिमाग का गले लगना।",
                advice: "Drink water, rest in dark room. If persists >2 days, consult doctor.",
                advice_hi: "पानी पिएं, अंधेरे कमरे में आराम करें। अगर 2 दिन से ज्यादा रहे तो डॉक्टर से मिलें।"
            });
        }

        if (lowerSymptoms.some(s => s.includes('fever') || s.includes('बुखार'))) {
            mockData.push({
                condition: "Mild Fever",
                condition_hi: "हल्का बुखार",
                severity: "Medium",
                severity_hi: "मध्यम",
                description: "Body warm like a cozy blanket, but check temperature.",
                description_hi: "शरीर गर्म लग रहा जैसे आरामदायक कंबल, लेकिन तापमान चेक करें।",
                advice: "Cool compress, fluids. Seek doctor if >101°F or persists.",
                advice_hi: "ठंडी सेंक, तरल पदार्थ। अगर 101°F से ज्यादा या बने रहें तो डॉक्टर जाएं।"
            });
        }

        if (lowerSymptoms.some(s => s.includes('cough') || s.includes('खांसी'))) {
            mockData.push({
                condition: "Common Cough",
                condition_hi: "सामान्य खांसी",
                severity: "Low",
                severity_hi: "मामूली",
                description: "Throat tickles and you cough, like dust in the air.",
                description_hi: "गला खुजली कर रहा और खांसी आ रही, जैसे हवा में धूल।",
                advice: "Honey in warm water, steam. Doctor if with chest pain.",
                advice_hi: "गर्म पानी में शहद, भाप लें। अगर छाती दर्द हो तो डॉक्टर जाएं।"
            });
        }

        if (lowerSymptoms.some(s => s.includes('stomach') || s.includes('पेट'))) {
            mockData.push({
                condition: "Indigestion",
                condition_hi: "अपच",
                severity: "Medium",
                severity_hi: "मध्यम",
                description: "Tummy feels full and bubbly after eating wrong things.",
                description_hi: "पेट भरा और उबाल जैसा लग रहा, गलत खाने से।",
                advice: "Light food, ginger tea. Seek help if vomiting blood.",
                advice_hi: "हल्का खाना, अदरक की चाय। अगर खून वाली उल्टी तो तुरंत डॉक्टर।"
            });
        }
        
        return mockData.slice(0, 3).map(addDisclaimer);  // Limit to 3
    }

    async listModels() {
        const timestamp = new Date().toISOString();
        if (!this.isInitialized) {
            console.warn(`[${timestamp}] Cannot list models: Not initialized`);
            return [];
        }
        try {
            const models = await this.ai.models.list();
            const modelNames = models.map(m => m.name);
            console.log(`[${timestamp}] Available models:`, modelNames);
            return modelNames;
        } catch (err) {
            console.error(`[${timestamp}] List models error:`, err.message);
            return [];
        }
    }

    // New: Health check for endpoints
    async healthCheck() {
        const timestamp = new Date().toISOString();
        return {
            status: this.isInitialized ? 'healthy' : 'degraded (fallback mode)',
            timestamp,
            models: await this.listModels(),
            cacheSize: cache.size
        };
    }

    isReady() {
        return this.isInitialized;
    }
}

const aiServiceInstance = new AIService();
module.exports = aiServiceInstance;