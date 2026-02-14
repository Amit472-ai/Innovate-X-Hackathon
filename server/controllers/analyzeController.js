const Condition = require('../models/Condition');
// verifying syntax
const Symptom = require('../models/Symptom');

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ msg: 'Please provide at least one symptom.' });
        }

        // Fallback to keyword matching if no key or mock key
        if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'mock-key-for-now') {
            console.log("Using keyword matching fallback (No API Key)");
            const conditions = await Condition.find({
                symptoms: { $in: symptoms.map(s => new RegExp(s, 'i')) }
            });

            const results = conditions.map(cond => ({
                condition: cond.name,
                condition_hi: cond.name_hi,
                severity: cond.severity,
                severity_hi: cond.severity_hi,
                description: cond.simplifiedDescription,
                description_hi: cond.simplifiedDescription_hi,
                advice: cond.advice,
                advice_hi: cond.advice_hi,
                matchParams: cond.symptoms.filter(s => symptoms.some(userSym => s.toLowerCase().includes(userSym.toLowerCase())))
            }));

            return res.json({
                results,
                disclaimer: "This is not medical advice. Consult a doctor for serious concerns.",
                disclaimer_hi: "यह चिकित्सा सलाह नहीं है। गंभीर समस्याओं के लिए डॉक्टर से सलाह लें।"
            });
        }

        // --- Real AI Logic ---
        // Using gemini-flash-latest as 1.5-flash 404s and 2.0-flash 429s (quota)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        Act as a medical assistant. Analyze these symptoms: "${symptoms.join(', ')}".
        Identify potential conditions (max 3).
        For each condition, provide:
        - Condition Name (English & Hindi)
        - Severity (Low, Medium, High, Critical) and its Hindi translation (कम, मध्यम, गंभीर, बहुत गंभीर)
        - Simplified Description (English & Hindi) - Explain simply like I'm 5.
        - Actionable Advice (English & Hindi) - What should I do at home?
        
        Respond ONLY with a valid JSON array in this format:
        [
            {
                "condition": "Condition Name",
                "condition_hi": "बीमारी का नाम",
                "severity": "Severity Level",
                "severity_hi": "गंभीरता स्तर",
                "description": "Simple definition",
                "description_hi": "सरल परिभाषा",
                "advice": "What to do",
                "advice_hi": "क्या करें"
            }
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // Sometimes AI adds text before/after json, try to extract json array
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        const aiResults = JSON.parse(jsonStr);

        // Add matchParams for frontend compatibility (optional, or just pass empty)
        const finalResults = aiResults.map(r => ({
            ...r,
            matchParams: symptoms // Just pass original symptoms as matches
        }));

        res.json({
            results: finalResults,
            disclaimer: "This is not medical advice. Consult a doctor for serious concerns. AI generated responses can be inaccurate.",
            disclaimer_hi: "यह चिकित्सा सलाह नहीं है। गंभीर समस्याओं के लिए डॉक्टर से सलाह लें। AI द्वारा उत्पन्न प्रतिक्रियाएं गलत हो सकती हैं।"
        });

    } catch (err) {
        console.error("AI Error Detailed:", err);
        // Fallback to keyword matching on error
        console.log("Fallback to local DB due to AI error");
        try {
            const { symptoms } = req.body; // Re-extract symptoms for fallback
            const conditions = await Condition.find({
                symptoms: { $in: symptoms.map(s => new RegExp(s, 'i')) }
            });

            const results = conditions.map(cond => ({
                condition: cond.name,
                condition_hi: cond.name_hi,
                severity: cond.severity,
                severity_hi: cond.severity_hi,
                description: cond.simplifiedDescription,
                description_hi: cond.simplifiedDescription_hi,
                advice: cond.advice,
                advice_hi: cond.advice_hi,
                matchParams: cond.symptoms.filter(s => symptoms.some(userSym => s.toLowerCase().includes(userSym.toLowerCase())))
            }));

            res.json({
                results,
                error: err.toString(), // Return error for debugging
                disclaimer: "This is not medical advice. Consult a doctor for serious concerns.",
                disclaimer_hi: "यह चिकित्सा सलाह नहीं है। गंभीर समस्याओं के लिए डॉक्टर से सलाह लें."
            });
        } catch (fallbackErr) {
            console.error("Fallback Error:", fallbackErr);
            res.status(500).send('Server Error: ' + fallbackErr.toString());
        }
    }
};

exports.getAllConditions = async (req, res) => {
    try {
        const conditions = await Condition.find().select('-__v');
        res.json(conditions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
