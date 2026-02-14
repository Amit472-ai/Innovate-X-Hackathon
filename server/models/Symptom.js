const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    relatedConditions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Condition'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Symptom', SymptomSchema);
