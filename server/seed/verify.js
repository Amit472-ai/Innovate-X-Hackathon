const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Condition = require('../models/Condition');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const conditions = await Condition.find({});
        console.log(`Found ${conditions.length} conditions`);

        conditions.forEach(c => {
            console.log(`Condition: ${c.name}`);
            console.log(`  Hindi Name: ${c.name_hi}`);
            console.log(`  Hindi Desc: ${c.description_hi}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
