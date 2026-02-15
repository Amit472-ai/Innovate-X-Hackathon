const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    symptoms: [{
        type: String,
        trim: true
    }],
    name_hi: {
        type: String,
        trim: true
    },
    symptoms_hi: [{
        type: String,
        trim: true
    }],
    severity_hi: {
        type: String,
        enum: ['निम्न', 'मध्यम', 'उच्च', 'गंभीर'],
        default: 'निम्न'
    },
    description_hi: {
        type: String,
        trim: true
    },
    simplifiedDescription_hi: {
        type: String,
        trim: true
    },
    advice_hi: {
        type: String,
        trim: true
    },
    disclaimer_hi: {
        type: String,
        trim: true,
        default: "यह चिकित्सा सलाह नहीं है। गंभीर चिंताओं के लिए डॉक्टर से परामर्श लें।"
    },

    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    description: {
        type: String, // Technical description
        required: true,
        trim: true
    },
    simplifiedDescription: {
        type: String, // AI simplified description
        required: true,
        trim: true
    },
    advice: {
        type: String, // Actionable advice
        required: true,
        trim: true
    },
    disclaimer: {
        type: String,
        trim: true,
        default: "This is not medical advice. Consult a doctor for serious concerns."
    }
}, {
    timestamps: true,
    // Indexes for performance
    indexes: [
        { name: 1 },  // Unique index (already implied, but explicit)
        { symptoms: "text" }  // Text index for efficient symptom searches
    ]
});

// Custom validator for symptoms array (at least one symptom)
ConditionSchema.path('symptoms').validate(function (value) {
    return value && value.length > 0;
}, 'At least one symptom is required.');

module.exports = mongoose.model('Condition', ConditionSchema);
