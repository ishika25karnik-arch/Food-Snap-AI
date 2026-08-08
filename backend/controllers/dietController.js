const db = require('../config/db');
const aiService = require('../services/aiService');

exports.generatePlan = async (req, res) => {
    try {
        const { goal, dietType, mealsPerDay, likedFoods, avoidedFoods } = req.body;
        
        const aiResult = await aiService.generateDietPlan({
            goal,
            dietType,
            mealsPerDay,
            likedFoods,
            avoidedFoods
        });
        
        res.json(aiResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate diet plan' });
    }
};

exports.savePlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { goal, dietType, daily_calorie_target, meals } = req.body;

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insert Plan
            const [planResult] = await connection.execute(
                `INSERT INTO diet_plans (user_id, goal, diet_type, daily_calorie_target) VALUES (?, ?, ?, ?)`,
                [userId, goal, dietType, daily_calorie_target]
            );
            const planId = planResult.insertId;

            // Insert Items
            for (const meal of meals) {
                for (const item of meal.items) {
                    await connection.execute(
                        `INSERT INTO diet_plan_items (diet_plan_id, food_name, meal_type, quantity, estimated_calories) VALUES (?, ?, ?, ?, ?)`,
                        [planId, item.food_name, meal.meal_type, item.quantity, item.estimated_calories]
                    );
                }
            }

            await connection.commit();
            res.status(201).json({ message: 'Diet plan saved successfully', id: planId });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save diet plan' });
    }
};

exports.getCurrentPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get the most recent plan
        const [plans] = await db.execute('SELECT * FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId]);
        
        if (plans.length === 0) {
            return res.json({ plan: null });
        }
        
        const plan = plans[0];
        
        // Get items for the plan
        const [items] = await db.execute('SELECT * FROM diet_plan_items WHERE diet_plan_id = ?', [plan.id]);
        
        // Group items by meal type
        const mealsMap = {};
        items.forEach(item => {
            if (!mealsMap[item.meal_type]) {
                mealsMap[item.meal_type] = {
                    meal_type: item.meal_type,
                    items: [],
                    total_meal_calories: 0
                };
            }
            mealsMap[item.meal_type].items.push(item);
            mealsMap[item.meal_type].total_meal_calories += item.estimated_calories;
        });

        res.json({
            plan: {
                ...plan,
                meals: Object.values(mealsMap)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch current diet plan' });
    }
};
