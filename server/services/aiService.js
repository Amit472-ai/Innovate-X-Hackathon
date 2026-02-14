const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
    constructor() {
        this.genAI = null;
        this.model = null;
        this.init();
    }

    init() {
        if (process.env.AI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
            // Using gemini-flash-latest as it is the stable free-tier friendly model (verified)
            this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        } else {
            console.warn("AI_API_KEY is not set. AI features will be disabled.");
        }
    }

    async generateAnalysis(symptoms) {
        if (!this.model) {
            throw new Error("AI Model not initialized");
        }

        const prompt = this._buildPrompt(symptoms);

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return this._parseResponse(text);
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }
    }

    _buildPrompt(symptoms) {
        return `
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
    }

    _parseResponse(text) {
        // Clean markdown code blocks if present
        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Sometimes AI adds text before/after json, try to extract json array
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse AI response:", text);
            throw new Error("Invalid AI response format");
        }
    }
}

module.exports = new AIService();
