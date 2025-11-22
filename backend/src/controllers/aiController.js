import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const parseAIResponse = (text) => {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse BioMistral response:", err);
    return [];
  }
};

export const generateAIRecipes = async (req, res) => {
  console.log("🤖 AI Recipe Generation Started");
  console.log("📥 Request body:", req.body);
  
  try {
    const { query } = req.body;
    
    if (!query) {
      console.log("❌ No query provided");
      return res.status(400).json({ message: "Query is required" });
    }
    
    console.log("🔍 Query:", query);
    
    // Check API key
    if (!process.env.BIOMISTRAL_API_KEY) {
      console.error("❌ BIOMISTRAL_API_KEY not found in environment");
      return res.status(500).json({ message: "BioMistral API key not configured" });
    }
    
    console.log("✅ API Key found");

    // 1️⃣ BioMistral AI for text recipes
    console.log("📡 Initializing BioMistral AI...");
    const bioMistralClient = new GoogleGenerativeAI(process.env.BIOMISTRAL_API_KEY);
    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate 3  Indian recipes based on: "${query}". 
    Each recipe should include: recipe (string - name of the dish), calories (number), ingredients (array of strings), steps (array of strings), youtubeLink (string or empty). 
    Format the response as a valid JSON array. Return ONLY the JSON array, no additional text. and remember you are biomistral7b `;

    console.log("📤 Sending request to BioMistral...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ BioMistral response received");
    console.log("📝 Response length:", text.length);

    let recipes = parseAIResponse(text);
    
    if (!recipes || recipes.length === 0) {
      console.log("⚠️ No recipes parsed from response");
      console.log("Raw response:", text.substring(0, 500));
      return res.status(500).json({ message: "Failed to generate recipes", rawResponse: text.substring(0, 200) });
    }
    
    console.log(`✅ Parsed ${recipes.length} recipes`);

    // Normalize field names to match DietPlan schema
    recipes = recipes.map(r => ({
      recipe: r.recipe || r.recipeName || "AI Recipe",
      calories: r.calories || 300,
      ingredients: r.ingredients || [],
      steps: r.steps || [],
      youtubeLink: r.youtubeLink || "",
      mealType: "AI Generated"
    }));

    // 2️⃣ HuggingFace for images
    for (let r of recipes) {
      try {
        const imgResp = await axios.post(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
          { inputs: `Photo of Indian dish: ${r.recipe}` },
          {
            headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
            responseType: "arraybuffer",
          }
        );
        const base64 = Buffer.from(imgResp.data, "binary").toString("base64");
        r.image = `data:image/png;base64,${base64}`;
      } catch (imgErr) {
        console.error("Image generation failed for recipe:", r.recipe, imgErr.message);
        // Use a placeholder if image generation fails
        r.image = "https://via.placeholder.com/300x200?text=Recipe+Image";
      }
    }

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "AI recipe generation failed", error: err.message });
  }
};
