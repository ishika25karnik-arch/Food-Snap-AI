const db = require('../config/db');
const aiService = require('../services/aiService');

// Helper to calculate health score based on macros
const calculateHealthScore = (nutrition) => {
    let score = 100;
    if (nutrition.sugar > 15) score -= 10;
    if (nutrition.sodium > 800) score -= 15;
    if (nutrition.fat > 20) score -= 5;
    if (nutrition.fiber >= 5) score += 10;
    if (nutrition.protein >= 15) score += 5;
    return Math.min(Math.max(Math.round(score), 0), 100);
};

const getHealthCategory = (score) => {
    if (score >= 90) return 'Excellent Choice';
    if (score >= 75) return 'Healthy Choice';
    if (score >= 50) return 'Moderate Choice';
    return 'Needs Improvement';
};

exports.analyzeFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const imagePath = req.file.path;
        const mimeType = req.file.mimetype;
        const imageUrl = `/uploads/${req.file.filename}`;

        // Call AI
        const aiResult = await aiService.analyzeFoodImage(imagePath, mimeType);
        
        res.json({
            ...aiResult,
            imageUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to analyze food image' });
    }
};

exports.searchFoodText = async (req, res) => {
    try {
        const { foodName } = req.body;
        if (!foodName) {
            return res.status(400).json({ message: 'Food name is required' });
        }

        // Try AI first for rich data (in a real app, query DB first, but for this demo, AI yields the richest data)
        const aiResult = await aiService.analyzeFoodText(foodName);
        
        res.json({
            ...aiResult,
            confirmedWeight: aiResult.estimatedWeight
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search food text' });
    }
};

exports.calculateNutrition = async (req, res) => {
    try {
        const { foodName, weight, category, confidence, ingredients, imageUrl } = req.body;
        
        const [ref] = await db.execute('SELECT * FROM nutrition_reference WHERE food_name LIKE ? LIMIT 1', [`%${foodName}%`]);
        
        if (ref.length === 0) {
            // If not in DB, use the AI text analysis as a fallback to get real nutrition for that specific food
            try {
                const aiResult = await aiService.analyzeFoodText(`${weight}g of ${foodName}`);
                return res.json({
                    ...aiResult,
                    confirmedWeight: weight,
                    imageUrl,
                    confidence
                });
            } catch(e) {
                // Ultimate fallback
                return res.json({
                    foodName,
                    category: category || "Unknown",
                    confidence,
                    confirmedWeight: weight,
                    ingredients,
                    imageUrl,
                    nutrition: {
                        calories: weight * 1.5, protein: weight * 0.05, carbohydrates: weight * 0.2,
                        fat: weight * 0.05, fiber: weight * 0.01, sugar: weight * 0.05, sodium: weight * 2,
                        calcium: 10, iron: 1, potassium: 100, vitamin_a: 0, vitamin_c: 0
                    },
                    benefits: [{title: "Nutrients", description: "Contains macronutrients"}],
                    thingsToWatch: [{title: "Portion Control", description: "Monitor your portions"}],
                    healthScore: 75,
                    healthCategory: 'Healthy Choice'
                });
            }
        }

        const data = ref[0];
        const multiplier = weight / 100;

        const nutrition = {
            calories: Math.round(data.calories_per_100g * multiplier),
            protein: Math.round(data.protein_per_100g * multiplier * 10) / 10,
            carbohydrates: Math.round(data.carbs_per_100g * multiplier * 10) / 10,
            fat: Math.round(data.fat_per_100g * multiplier * 10) / 10,
            fiber: Math.round(data.fiber_per_100g * multiplier * 10) / 10,
            sugar: Math.round(data.sugar_per_100g * multiplier * 10) / 10,
            sodium: Math.round(data.sodium_per_100g * multiplier),
            calcium: Math.round(data.calcium_per_100g * multiplier),
            iron: Math.round(data.iron_per_100g * multiplier * 10) / 10,
            potassium: Math.round(data.potassium_per_100g * multiplier),
            vitamin_a: Math.round(data.vitamin_a_per_100g * multiplier),
            vitamin_c: Math.round(data.vitamin_c_per_100g * multiplier * 10) / 10,
        };

        const healthScore = calculateHealthScore(nutrition);
        const healthCategory = getHealthCategory(healthScore);

        res.json({
            foodName: data.food_name,
            category: data.category,
            confidence,
            confirmedWeight: weight,
            ingredients,
            imageUrl,
            nutrition,
            benefits: [{title: "Energy", description: "Provides energy for daily activities"}],
            thingsToWatch: [{title: "Portion Size", description: "Large portions increase calorie intake"}],
            healthScore,
            healthCategory,
            servingSuggestion: `A standard portion is around ${weight}g`,
            healthierTips: ["Consider boiling or steaming", "Pair with vegetables"],
            dietRecommendation: "Can be included in most balanced diets in moderation."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to calculate nutrition' });
    }
};

exports.saveScan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            foodName, category, confidence, estimatedWeight, confirmedWeight, 
            nutrition, healthScore, healthCategory, imageUrl 
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO food_scans (
                user_id, food_name, category, confidence, estimated_weight, confirmed_weight, 
                calories, protein, carbohydrates, fat, fiber, sugar, sodium, 
                health_score, health_category, image_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, foodName, category, confidence || null, estimatedWeight || confirmedWeight, confirmedWeight,
                nutrition.calories, nutrition.protein, nutrition.carbohydrates, nutrition.fat, 
                nutrition.fiber, nutrition.sugar, nutrition.sodium,
                healthScore, healthCategory, imageUrl || null
            ]
        );

        res.status(201).json({ message: 'Scan saved', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save scan' });
    }
};

exports.saveFavoriteFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodName, category } = req.body;

        const [result] = await db.execute(
            `INSERT INTO saved_foods (user_id, food_name, category) VALUES (?, ?, ?)`,
            [userId, foodName, category]
        );
        res.status(201).json({ message: 'Food saved successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save favorite food' });
    }
};

exports.getFavoriteFoods = async (req, res) => {
    try {
        const userId = req.user.id;
        const [foods] = await db.execute('SELECT * FROM saved_foods WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json({ foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch favorite foods' });
    }
};

exports.deleteFavoriteFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const foodId = req.params.id;
        await db.execute('DELETE FROM saved_foods WHERE id = ? AND user_id = ?', [foodId, userId]);
        res.json({ message: 'Food deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete favorite food' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [scans] = await db.execute('SELECT * FROM food_scans WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json({ scans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

exports.getFoodById = async (req, res) => {
    try {
        const userId = req.user.id;
        const scanId = req.params.id;
        const [scans] = await db.execute('SELECT * FROM food_scans WHERE id = ? AND user_id = ?', [scanId, userId]);
        
        if (scans.length === 0) {
            return res.status(404).json({ message: 'Scan not found' });
        }
        res.json({ scan: scans[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch scan' });
    }
};

exports.deleteScan = async (req, res) => {
    try {
        const userId = req.user.id;
        const scanId = req.params.id;
        await db.execute('DELETE FROM food_scans WHERE id = ? AND user_id = ?', [scanId, userId]);
        res.json({ message: 'Scan deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete scan' });
    }
};
