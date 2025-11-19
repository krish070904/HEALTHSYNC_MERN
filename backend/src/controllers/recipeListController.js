import { textModel as gemini } from "../utils/geminiClient.js";
import axios from "axios";

export const getRecipes = async (req, res) => {
  try {
    const { disease, type, category, search } = req.query;

    const prompt = `
Generate 12 Indian diet recipes.

Filters:
- Disease: ${disease}
- Type: ${type}
- Category: ${category}
- Search: ${search}

Return JSON ONLY with this format:

{
  "recipes": [
    {
      "title": "",
      "imagePrompt": "",   // <-- added
      "calories": "",
      "tags": [],
      "ingredients": [],
      "instructions": [],
      "nutrition": {},
      "portion": ""
    }
  ]
}
`;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    res.json(JSON.parse(text));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed generating recipe list" });
  }
};
