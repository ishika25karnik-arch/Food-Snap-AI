const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config();

// Initialize the SDK
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

const JSON_PROMPT_TEMPLATE = `
Analyze the provided food and return a JSON object ONLY. Do NOT use markdown code blocks like \`\`\`json. Return pure JSON.
Structure:
{
    "foodName": "Name of the food (e.g., Cooked Rice, Dal, Pizza, Apple, Tulsi)",
    "category": "Category (e.g., Herb, Fast Food, Fruit, Grain)",
    "confidence": 95,
    "ingredients": ["Ingredient 1", "Ingredient 2"],
    "estimatedWeight": 200,
    "servingDescription": "1 medium serving",
    "cookingMethod": "Cooking method if apparent",
    "nutrition": {
        "calories": 250,
        "protein": 12.5,
        "carbohydrates": 30.0,
        "fat": 5.0,
        "fiber": 2.5,
        "sugar": 1.0,
        "sodium": 300
    },
    "benefits": [
        { "title": "Plant Compounds", "description": "Contains naturally occurring plant compounds." }
    ],
    "thingsToWatch": [
        { "title": "Individual Sensitivity", "description": "Individual tolerance may vary." }
    ],
    "healthScore": 85,
    "healthCategory": "Excellent Choice",
    "servingSuggestion": "Use as part of a balanced meal.",
    "healthierTips": ["Tip 1", "Tip 2"],
    "dietRecommendation": "Can be included in most balanced diets."
}

CRITICAL RULES:
1. Do NOT make medical claims like "Cures cancer" or "Treats diabetes".
2. Use careful language: "May support", "Contains", "Traditionally used for".
3. Use realistic nutrition estimates for the estimated weight provided.
4. ONLY output valid JSON.
`;

exports.analyzeFoodImage = async (imagePath, mimeType) => {
    try {
        const imagePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
                mimeType: mimeType || "image/jpeg"
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [JSON_PROMPT_TEMPLATE, imagePart],
            config: {
                responseMimeType: "application/json",
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Analysis error:", error);
        throw new Error("Failed to analyze image");
    }
};

exports.analyzeFoodText = async (foodName) => {
    try {
        const prompt = `Analyze the following food item: "${foodName}". \n\n${JSON_PROMPT_TEMPLATE}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Text Analysis error:", error);
        throw new Error("Failed to analyze food text");
    }
};

exports.generateDietPlan = async (preferences) => {
    try {
        const prompt = `
Generate a personalized daily diet plan based on these preferences:
Goal: ${preferences.goal}
Diet Type: ${preferences.dietType}
Meals per Day: ${preferences.mealsPerDay}
Foods Liked: ${preferences.likedFoods || 'None specified'}
Foods Avoided: ${preferences.avoidedFoods || 'None specified'}

CRITICAL RULES:
1. Do NOT pretend to calculate medically precise calorie requirements. This is an estimate.
2. Return a JSON object ONLY. Do NOT use markdown code blocks like \`\`\`json. Return pure JSON.

Structure:
{
    "daily_calorie_target": 2000,
    "macros": {
        "protein_target": 100,
        "carbs_target": 250,
        "fat_target": 65,
        "fiber_target": 30
    },
    "meals": [
        {
            "meal_type": "Breakfast",
            "items": [
                { "food_name": "Oats", "quantity": "50g", "estimated_calories": 190 },
                { "food_name": "Milk", "quantity": "200ml", "estimated_calories": 120 }
            ],
            "total_meal_calories": 310
        }
    ],
    "disclaimer": "This is a general estimate and not a substitute for professional medical advice."
}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Diet Generation error:", error);
        throw new Error("Failed to generate diet plan");
    }
};
