const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Condition = require('../models/Condition');
const Symptom = require('../models/Symptom');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for Seeding');

        // Clear existing data
        await Condition.deleteMany({});
        await Symptom.deleteMany({});

        // --- Conditions ---
        const conditions = [
            {
                name: 'Common Cold',
                name_hi: 'साधारण सर्दी-जुकाम',
                symptoms: ['runny nose', 'sneezing', 'sore throat', 'cough'],
                symptoms_hi: ['बहती नाक', 'छींकना', 'गले में खराश', 'खांसी'],
                severity: 'Low',
                severity_hi: 'कम',
                description: 'Viral infection of the upper respiratory tract.',
                description_hi: 'श्वसन तंत्र का वायरल संक्रमण।',
                simplifiedDescription: 'A common viral infection that affects your nose and throat. It usually clears up in a week.',
                simplifiedDescription_hi: 'एक सामान्य संक्रमण जो आपकी नाक और गले को प्रभावित करता है। यह आमतौर पर एक सप्ताह में ठीक हो जाता है।',
                advice: 'Rest, stay hydrated, and use over-the-counter remedies for symptoms.',
                advice_hi: 'आराम करें, खूब पानी पिएं और लक्षणों के लिए सामान्य दवाएं लें।',
            },
            {
                name: 'Flu (Influenza)',
                name_hi: 'फ्लू (इन्फ्लूएंजा)',
                symptoms: ['fever', 'chills', 'muscle aches', 'cough', 'fatigue'],
                symptoms_hi: ['बुखार', 'ठंड लगना', 'मांसपेशियों में दर्द', 'खांसी', 'थकान'],
                severity: 'Medium',
                severity_hi: 'मध्यम',
                description: 'Viral infection that attacks the respiratory system.',
                description_hi: 'वायरल संक्रमण जो श्वसन प्रणाली पर हमला करता है।',
                simplifiedDescription: 'A viral infection that can make you feel very tired and achy. It is more severe than a cold.',
                simplifiedDescription_hi: 'एक वायरल संक्रमण जिससे आप बहुत थकान और दर्द महसूस कर सकते हैं। यह सर्दी से अधिक गंभीर होता है।',
                advice: 'Rest, drink plenty of fluids. See a doctor if symptoms are severe or persistent.',
                advice_hi: 'आराम करें, बहुत सारे तरल पदार्थ पिएं। यदि लक्षण गंभीर हों तो डॉक्टर को दिखाएं।',
            },
            {
                name: 'Migraine',
                name_hi: 'माइग्रेन (अधकपारी)',
                symptoms: ['headache', 'nausea', 'sensitivity to light', 'throbbing pain'],
                symptoms_hi: ['सिरदर्द', 'जी मिचलाना', 'प्रकाश के प्रति संवेदनशीलता', 'तेज दर्द'],
                severity: 'Medium',
                severity_hi: 'मध्यम',
                description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.',
                description_hi: 'विभिन्न तीव्रता का सिरदर्द, जिसके साथ अक्सर जी मिचलाना और प्रकाश/ध्वनि के प्रति संवेदनशीलता होती है।',
                simplifiedDescription: 'A severe headache that can cause throbbing pain and make you sensitive to light and sound.',
                simplifiedDescription_hi: 'एक गंभीर सिरदर्द जो तेज दर्द पैदा कर सकता है और आपको प्रकाश और ध्वनि के प्रति संवेदनशील बना सकता है।',
                advice: 'Rest in a dark, quiet room. Over-the-counter pain relievers may help.',
                advice_hi: 'अंधेरे और शांत कमरे में आराम करें। दर्द निवारक दवाएं मदद कर सकती हैं।',
            },
            {
                name: 'Gastroenteritis (Stomach Flu)',
                name_hi: 'पेट का संक्रमण (Gastroenteritis)',
                symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps'],
                symptoms_hi: ['जी मिचलाना', 'उल्टी', 'दस्त', 'पेट में ऐंठन'],
                severity: 'Medium',
                severity_hi: 'मध्यम',
                description: 'Inflammation of the lining of the intestines caused by a virus, bacteria, or parasites.',
                description_hi: 'वायरस, बैक्टीरिया या परजीवी के कारण आंतों की परत में सूजन।',
                simplifiedDescription: 'An infection in your stomach that causes vomiting and diarrhea. It is often called the stomach flu.',
                simplifiedDescription_hi: 'आपके पेट में एक संक्रमण जो उल्टी और दस्त का कारण बनता है। इसे अक्सर "पेट का फ्लू" कहा जाता है।',
                advice: 'Stay hydrated with water or electrolyte drinks. Eat bland foods like toast and rice.',
                advice_hi: 'पानी या ओआरएस (ORS) के साथ हाइड्रेटेड रहें। टोस्ट और चावल जैसा हल्का भोजन करें।',
            },
            {
                name: 'Heart Attack',
                name_hi: 'दिल का दौरा (Heart Attack)',
                symptoms: ['chest pain', 'shortness of breath', 'pain in arm', 'nausea'],
                symptoms_hi: ['सीने में दर्द', 'सांस लेने में तकलीफ', 'हाथ में दर्द', 'जी मिचलाना'],
                severity: 'Critical',
                severity_hi: 'गंभीर',
                description: 'A blockage of blood flow to the heart muscle.',
                description_hi: 'हृदय की मांसपेशियों में रक्त के प्रवाह में रुकावट।',
                simplifiedDescription: 'A serious condition where blood flow to the heart is blocked. This is a medical emergency.',
                simplifiedDescription_hi: 'एक गंभीर स्थिति जहां हृदय में रक्त का प्रवाह अवरुद्ध हो जाता है। यह एक मेडिकल इमरजेंसी है।',
                advice: 'Call emergency services immediately. Do not drive yourself to the hospital.',
                advice_hi: 'तुरंत एम्बुलेंस बुलाएं। खुद गाड़ी चलाकर अस्पताल न जाएं।',
            }
        ];

        // Insert Conditions
        const createdConditions = await Condition.insertMany(conditions);
        console.log(`Seeded ${createdConditions.length} conditions`);

        // Create Symptoms mapping (Optional, if we want strict symptom entities)
        // For now, the controller uses simple string matching on Condition.symptoms array.
        // But let's populate Symptom model for autocomplete features later.

        const allSymptoms = new Set();
        conditions.forEach(c => c.symptoms.forEach(s => allSymptoms.add(s)));

        const symptomDocs = Array.from(allSymptoms).map(name => ({ name }));
        await Symptom.insertMany(symptomDocs);
        console.log(`Seeded ${symptomDocs.length} unique symptoms`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
