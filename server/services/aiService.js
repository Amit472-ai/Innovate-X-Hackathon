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
You are a medical assistant. Provide concise, structured health guidance.
Do NOT diagnose or prescribe definitively. Offer common knowledge suggestions.

User problem: "${symptoms.join(', ')}"

Provide response ONLY in valid JSON format (Array of objects).
Each object must have these exact fields:
- condition: string (Name of condition)
- severity: "Low" | "Medium" | "High" | "Critical"
- description: string (Brief explanation, max 2 sentences)
- medicines: array of strings (Proper OTC medicine names, e.g., "Paracetamol 500mg", "Ibuprofen 400mg")
- precautions: array of strings (Safety measures to avoid worsening)
- home_remedies: array of strings (Quick relief methods obtainable at home)
- advice: string (When to see a doctor)

Example Output:
[
    {
        "condition": "Tension Headache",
        "severity": "Low",
        "description": "Pain or discomfort in the head or scalp.",
        "medicines": ["Paracetamol (Acetaminophen)", "Ibuprofen"],
        "precautions": ["Avoid bright screens", "Rest in a dark room"],
        "home_remedies": ["Cold compress on forehead", "Drink ginger tea"],
        "advice": "Consult a doctor if headache is severe or persists."
    }
]

Rules:
- Always include at least 1-2 items for medicines, precautions, and home_remedies.
- Suggest only Over-The-Counter (OTC) medicines.
- Output ONLY JSON.
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
                medicines: ["None"],
                medicines_hi: ["कोई नहीं"],
                precautions: ["Avoid overexertion", "Maintain regular sleep schedule"],
                precautions_hi: ["अत्यधिक मेहनत से बचें", "नियमित नींद का पालन करें"],
                home_remedies: ["Rest well", "Drink plenty of water", "Eat nutritious food"],
                home_remedies_hi: ["अच्छी तरह आराम करें", "पर्याप्त पानी पिएं", "पौष्टिक भोजन करें"],
                advice: "See doctor if fatigue lasts more than 1 week or worsens.",
                advice_hi: "अगर थकान 1 हफ्ते से ज्यादा रहे या बढ़े तो डॉक्टर से मिलें।"
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
                home_remedies: ["Drink water", "Rest in a quiet, dark room", "Apply a cool compress to forehead"],
                home_remedies_hi: ["पानी पिएं", "शांत, अंधेरे कमरे में आराम करें", "माथे पर ठंडी पट्टी रखें"],
                medicines: ["Paracetamol (if needed)"],
                medicines_hi: ["पैरासिटामोल (यदि आवश्यक हो)"],
                precautions: ["Limit screen time", "Avoid loud noises", "Do not skip meals"],
                precautions_hi: ["स्क्रीन समय सीमित करें", "तेज आवाज़ से बचें", "भोजन न छोड़ें"],
                advice: "Consult doctor if headache persists more than 2 days or is severe.",
                advice_hi: "अगर सिरदर्द 2 दिन से ज्यादा रहे या तेज़ हो तो डॉक्टर से मिलें।"
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
                home_remedies: ["Cool compress on forehead", "Drink plenty of fluids", "Rest well"],
                home_remedies_hi: ["माथे पर ठंडी पट्टी रखें", "पर्याप्त तरल पदार्थ पिएं", "अच्छी तरह आराम करें"],
                medicines: ["Paracetamol (if temperature >100°F)"],
                medicines_hi: ["पैरासिटामोल (अगर तापमान 100°F से ज्यादा हो)"],
                precautions: ["Monitor temperature regularly", "Avoid heavy clothing", "Do not self-medicate with antibiotics"],
                precautions_hi: ["तापमान नियमित जांचें", "भारी कपड़े न पहनें", "एंटीबायोटिक दवा खुद न लें"],
                advice: "Seek doctor if fever >101°F, lasts more than 3 days, or with other severe symptoms.",
                advice_hi: "अगर बुखार 101°F से ज्यादा हो, 3 दिन से ज्यादा रहे या अन्य गंभीर लक्षण हों तो डॉक्टर से मिलें।"
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
                home_remedies: ["Honey in warm water (2-3 times/day)", "Steam inhalation", "Gargle with salt directly"],
                home_remedies_hi: ["गर्म पानी में शहद (दिन में 2-3 बार)", "भाप लें", "नमक वाले पानी से गरारे करें"],
                medicines: ["Dextromethorphan (for dry cough)", "Guaifenesin (for wet cough)"],
                medicines_hi: ["डेक्सट्रोमेथोर्फन (सूखी खांसी के लिए)", "गुआइफेनेसिन (गीली खांसी के लिए)"],
                precautions: ["Avoid cold drinks", "Do not smoke", "Cover mouth while coughing"],
                precautions_hi: ["ठंडे पेय से बचें", "धूम्रपान न करें", "खांसते समय मुंह ढकें"],
                advice: "See doctor if cough lasts more than 1 week or with chest pain.",
                advice_hi: "अगर खांसी 1 हफ्ते से ज्यादा रहे या छाती में दर्द हो तो डॉक्टर से मिलें।"
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
                home_remedies: ["Eat light, easily digestible food", "Drink ginger tea", "Avoid spicy foods"],
                home_remedies_hi: ["हल्का, आसानी से पचने वाला खाना खाएं", "अदरक की चाय पिएं", "मसालेदार भोजन से बचें"],
                medicines: ["Antacid (if needed)"],
                medicines_hi: ["एंटासिड (यदि आवश्यक हो)"],
                precautions: ["Eat slowly", "Do not lie down immediately after eating", "Avoid overeating"],
                precautions_hi: ["धीरे-धीरे खाएं", "खाने के तुरंत बाद न लेटें", "अधिक न खाएं"],
                advice: "Seek help if severe pain, blood in vomit, or symptoms persist.",
                advice_hi: "अगर तेज़ दर्द, उल्टी में खून या लक्षण बने रहें तो डॉक्टर से मिलें।"
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