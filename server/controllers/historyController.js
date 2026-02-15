const Report = require('../models/Report');

exports.saveReport = async (req, res) => {
    try {
        const { symptoms, analysis } = req.body;

        const newReport = new Report({
            userId: req.user.id,
            symptoms,
            analysis
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getHistory = async (req, res) => {
    try {
        // Find reports by user ID, sort by newest first
        const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
