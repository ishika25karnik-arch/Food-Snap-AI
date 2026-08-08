const aiService = require('./services/aiService');

async function test() {
    try {
        const result = await aiService.analyzeFoodText('Paneer');
        console.log("Success:", result);
    } catch (err) {
        console.error("Error:", err);
    }
}
test();
