const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

// @route   POST /api/analyze
// @desc    Analyze symptoms and return conditions
// @access  Public
router.post('/analyze', analyzeController.analyzeSymptoms);

// @route   GET /api/conditions
// @desc    Get all satisfied conditions (for debugging/list)
// @access  Public
router.get('/conditions', analyzeController.getAllConditions);

module.exports = router;
