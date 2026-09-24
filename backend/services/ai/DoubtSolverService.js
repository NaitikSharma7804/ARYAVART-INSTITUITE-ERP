const { OpenAI } = require("openai");

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "dummy_key",
});

class DoubtSolverService {
    async solve(studentId, instituteId, question) {
        try {
            const completion = await openai.chat.completions.create({
                // Use the exact ID from your screenshot
                model: "google/gemma-4-26b-a4b-it:free", 
                messages: [{ role: "user", content: question }],
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error("OpenRouter API Error:", error);
            throw error;
        }
    }
}

module.exports = new DoubtSolverService();