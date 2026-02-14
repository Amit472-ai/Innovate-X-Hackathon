const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    symptoms: [{
        type: String
    }],
    name_hi: { type: String },
    symptoms_hi: [{ type: String }],
    severity_hi: { type: String }, // Can be mapping or direct string
    description_hi: { type: String },
    simplifiedDescription_hi: { type: String },
    advice_hi: { type: String },
    disclaimer_hi: { type: String },

    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    description: {
        type: String, // Technical description
        required: true
    },
    simplifiedDescription: {
        type: String, // AI simplified description
        required: true
    },
    advice: {
        type: String, // Actionable advice
        required: true
    },
    disclaimer: {
        type: String,
        default: "This is not medical advice. Consult a doctor for serious concerns."
    }
}, { timestamps: true });

module.exports = mongoose.model('Condition', ConditionSchema);
