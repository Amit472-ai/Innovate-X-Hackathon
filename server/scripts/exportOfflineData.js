const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Condition = require('../models/Condition');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const exportData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected...');

        const conditions = await Condition.find({});
        console.log(`Found ${conditions.length} conditions.`);

        const exportData = conditions.map(c => ({
            name: c.name,
            symptoms: c.symptoms,
            severity: c.severity,
            description: c.simplifiedDescription,
            advice: c.advice,
            name_hi: c.name_hi,
            symptoms_hi: c.symptoms_hi,
            severity_hi: c.severity_hi,
            description_hi: c.simplifiedDescription_hi,
            advice_hi: c.advice_hi,
            matchParams: c.symptoms // pre-fill for offline logic
        }));

        const outputPath = path.join(__dirname, '..', '..', 'client', 'public', 'offline_data.json');

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        console.log(`Data exported successfully to ${outputPath}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

exportData();
