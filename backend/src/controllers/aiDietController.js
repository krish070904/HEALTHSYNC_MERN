// backend/src/controllers/aiDietController.js
import axios from "axios";
import DietPlan from "../models/DietPlan.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIDiet = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.body;

    // 1️⃣ Gemini LLM for recipe text
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate 1 Indian recipe based on: "${query}". 
    Include: recipe (string - name of the dish), calories (number), ingredients (array of strings), steps (array of strings), youtubeLink (string or empty). 
    Format as a valid JSON object. Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse Gemini response
    let recipe;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipe = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", parseErr);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    // Normalize to match DietPlan schema
    const recipeName = recipe.recipe || recipe.recipeName || "AI Meal";
    const normalizedRecipe = {
      recipe: recipeName,
      calories: recipe.calories || 300,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      youtubeLink: recipe.youtubeLink || ""
    };

    // 2️⃣ Stable Diffusion image via HuggingFace
    let imageUrl = "https://via.placeholder.com/300x200?text=Recipe+Image";
    try {
      const imageResp = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
        { inputs: `Photo of Indian dish: ${recipeName}` },
        { 
          headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` }, 
          responseType: "arraybuffer" 
        }
      );

      const base64 = Buffer.from(imageResp.data, "binary").toString("base64");
      imageUrl = `data:image/png;base64,${base64}`;
    } catch (imgErr) {
      console.error("Image generation failed:", imgErr.message);
      // Continue with placeholder image
    }

    // 3️⃣ Save AI meal to DB
    const aiMeal = {
      mealType: "AI Meal",
      ...normalizedRecipe,
      image: imageUrl,
    };

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const dietPlan = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });
    if (!dietPlan) return res.status(404).json({ message: "No diet plan found" });

    const todayPlan = dietPlan.dailyMeals.find(d => d.day === today);
    if (todayPlan) todayPlan.meals.push(aiMeal);

    await dietPlan.save();

    res.json({ aiMeal });

  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ message: "AI meal generation failed", error: err.message });
  }
};
