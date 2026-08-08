const express = require('express');
const dietController = require('../controllers/dietController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/generate', verifyToken, dietController.generatePlan);
router.post('/save', verifyToken, dietController.savePlan);
router.get('/current', verifyToken, dietController.getCurrentPlan);

module.exports = router;
