const Condition = require('../models/Condition');

class FallbackService {
    async findConditionsByKeywords(symptoms) {
        if (!symptoms || symptoms.length === 0) return [];

        console.log("Using keyword matching fallback");

        try {
            // Find conditions where any symptom regex matches
            const conditions = await Condition.find({
                symptoms: { $in: symptoms.map(s => new RegExp(s, 'i')) }
            });

            return conditions.map(cond => this._formatCondition(cond, symptoms));
        } catch (error) {
            console.error("Fallback Service Error:", error);
            throw error;
        }
    }

    _formatCondition(cond, userSymptoms) {
        return {
            condition: cond.name,
            condition_hi: cond.name_hi,
            severity: cond.severity,
            severity_hi: cond.severity_hi,
            description: cond.simplifiedDescription,
            description_hi: cond.simplifiedDescription_hi,
            advice: cond.advice,
            advice_hi: cond.advice_hi,
            // Calculate matched parameters for frontend highlighting
            matchParams: cond.symptoms.filter(s =>
                userSymptoms.some(userSym => s.toLowerCase().includes(userSym.toLowerCase()))
            )
        };
    }
}

module.exports = new FallbackService();
