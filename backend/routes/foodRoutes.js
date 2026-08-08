const express = require('express');
const multer = require('multer');
const foodController = require('../controllers/foodController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/analyze', verifyToken, upload.single('image'), foodController.analyzeFood);
router.post('/search', verifyToken, foodController.searchFoodText);
router.post('/calculate', verifyToken, foodController.calculateNutrition);
router.post('/save', verifyToken, foodController.saveScan);

router.get('/history', verifyToken, foodController.getHistory);
router.get('/:id', verifyToken, foodController.getFoodById);
router.delete('/:id', verifyToken, foodController.deleteScan);

router.post('/favorites', verifyToken, foodController.saveFavoriteFood);
router.get('/favorites/all', verifyToken, foodController.getFavoriteFoods);
router.delete('/favorites/:id', verifyToken, foodController.deleteFavoriteFood);

module.exports = router;
