import DietPlan from "../models/DietPlan.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIDiet = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.body;

    const bioMistralClient = new GoogleGenerativeAI(process.env.BIOMISTRAL_API_KEY);
    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate 1 Indian recipe based on: "${query}". Include: recipe (string - name of the dish), calories (number), ingredients (array of strings), steps (array of strings), youtubeLink (string or empty). Format as a valid JSON object. Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let recipe;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipe = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    const recipeName = recipe.recipe || recipe.recipeName || "AI Meal";
    const normalizedRecipe = {
      recipe: recipeName,
      calories: recipe.calories || 300,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      youtubeLink: recipe.youtubeLink || ""
    };

    const aiMeal = { mealType: "AI Meal", ...normalizedRecipe, image: "https://via.placeholder.com/300x200?text=Recipe+Image" };
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const dietPlan = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });
    if (!dietPlan) return res.status(404).json({ message: "No diet plan found" });

    const todayPlan = dietPlan.dailyMeals.find(d => d.day === today);
    if (todayPlan) todayPlan.meals.push(aiMeal);

    await dietPlan.save();
    res.json({ aiMeal });
  } catch (err) {
    res.status(500).json({ message: "AI meal generation failed", error: err.message });
  }
};

export const generatePersonalizedDietPlan = async (userId, data) => {
  try {
    const { monitoringData, healthAnalysis } = data;
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);
    if (!user) return;

    const bioMistralClient = new GoogleGenerativeAI(process.env.BIOMISTRAL_API_KEY);
    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `
**User Profile:**
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Disease Tags: ${user.diseaseTags?.join(', ') || 'None'}
- Diet Type: ${user.dietType}

**Today's Health Data:**
- Sleep: ${monitoringData.sleep?.hours || 0}h (quality: ${monitoringData.sleep?.quality || 0}/5)
- Water: ${monitoringData.water?.liters || 0}L
- Mood: ${monitoringData.mood?.score || 0}/5
- Vitals: Sugar ${monitoringData.vitals?.sugar || 'N/A'}, BP ${monitoringData.vitals?.bpHigh || 'N/A'}/${monitoringData.vitals?.bpLow || 'N/A'}

**Health Analysis:**
${healthAnalysis?.summary || 'Health data recorded'}

**Diet Focus:**
${healthAnalysis?.dietFocus || 'Balanced nutrition'}
`;

    const prompt = `Generate a complete weekly Indian diet plan for this user.

${context}

Create a 7-day meal plan with:
- Breakfast (with calories, ingredients, steps)
- Lunch (with calories, ingredients, steps)
- Dinner (with calories, ingredients, steps)

Requirements:
- Use Indian recipes
- Consider diet type: ${user.dietType}
- Address health conditions: ${user.diseaseTags?.join(', ') || 'None'}
- Include portion sizes
- Total daily calories should be appropriate for their profile
- Be practical and affordable

Format as JSON:
{
  "weekPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "mealType": "Breakfast",
          "recipe": "...",
          "calories": 300,
          "ingredients": ["..."],
          "steps": ["..."]
        }
      ]
    }
  ]
}

Return ONLY the JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;

    const dietData = JSON.parse(jsonMatch[0]);
    const dietPlan = new DietPlan({
      userId,
      dailyMeals: dietData.weekPlan.map(day => ({
        day: day.day,
        meals: day.meals.map(meal => ({ ...meal, image: "https://via.placeholder.com/300x200?text=Meal+Image", youtubeLink: "" }))
      })),
      generatedFrom: "daily-monitoring",
      monitoringDate: monitoringData.date
    });

    await dietPlan.save();
    console.log(`Personalized diet plan generated for user ${userId}`);
  } catch (error) {
    console.error("Error generating personalized diet plan:", error);
  }
};
