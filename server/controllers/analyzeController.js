const aiService = require('../services/aiService');
const fallbackService = require('../services/fallbackService');

exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ msg: 'Please provide at least one symptom.' });
        }

        let results;
        try {
            // Try AI analysis first
            results = await aiService.generateAnalysis(symptoms);

            // Add matchParams for frontend compatibility (pass original symptoms)
            results = results.map(r => ({
                ...r,
                matchParams: symptoms
            }));

            res.json({
                results: results,
                disclaimer: "This is not medical advice. Consult a doctor for serious concerns. AI generated responses can be inaccurate.",
                disclaimer_hi: "यह चिकित्सा सलाह नहीं है। गंभीर समस्याओं के लिए डॉक्टर से सलाह लें। AI द्वारा उत्पन्न प्रतिक्रियाएं गलत हो सकती हैं।"
            });

        } catch (aiError) {
            console.error("AI Analysis Failed, switching to fallback:", aiError.message);

            // Fallback to local DB
            results = await fallbackService.findConditionsByKeywords(symptoms);

            res.json({
                results,
                error: aiError.toString(), // Optional: return error for debugging purposes
                disclaimer: "This is not medical advice. Consult a doctor for serious concerns.",
                disclaimer_hi: "यह चिकित्सा सलाह नहीं है। गंभीर समस्याओं के लिए डॉक्टर से सलाह लें."
            });
        }

    } catch (err) {
        console.error("Analyze Controller Error:", err);
        res.status(500).send('Server Error');
    }
};

exports.getAllConditions = async (req, res) => {
    try {
        // We need to import Condition model here if we want to keep this endpoint
        // Or better, move this to a ConditionService or keep logic here if simple.
        // For now, let's re-import Condition or just use Mongoose model directly if needed.
        // But to keep it clean, let's just leave it but ensure Condition is required if used.
        const Condition = require('../models/Condition');
        const conditions = await Condition.find().select('-__v');
        res.json(conditions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
