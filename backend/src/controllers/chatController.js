import ChatHistory from "../models/ChatHistory.js";
import DietPlan from "../models/DietPlan.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const sendMessage = async (req, res) => {
  const userMessage = req.body.text;
  const sessionId = req.body.sessionId || null;
  const userId = req.user._id;

  if (!process.env.GEMINI_API_KEY) {
    const mockReply = "I’m here to help! (Mock response – set GEMINI_API_KEY in .env)";
    // Save mock chat
    let chat = await ChatHistory.findOne({ userId, sessionId });
    if (!chat) chat = new ChatHistory({ userId, sessionId, messages: [] });
    chat.messages.push({ sender: "user", text: userMessage });
    chat.messages.push({ sender: "bot", text: mockReply });
    await chat.save();
    return res.json({ reply: mockReply });
  }

  try {
    // --- GEMINI AI CALL ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      You are an expert Indian health and nutrition assistant. Your goal is to help the user with their health and diet queries in a mature, understanding, and professional manner. You must always prioritize Indian foods only; do not suggest foreign foods like steak, burgers, or pizzas.

CRITICAL INSTRUCTIONS:

If the user mentions a specific health condition, symptom, or requests a diet change (e.g., diabetes, high blood pressure, nausea, stomach pain, fever, weight management), you MUST generate a customized 7-day diet plan tailored to their needs, using Indian foods, ingredients, and cooking methods.

The diet plan must include daily meals (Breakfast, Lunch, Dinner) with the following for each meal:

Recipe name

Approximate calories

List of ingredients

Step-by-step cooking instructions

If the user does not require a diet update or no health condition is mentioned, do not generate a diet plan and set "dietPlan": null.

Always be polite, informative, and supportive in your conversational response. You may ask for clarification about health conditions, food preferences, or dietary restrictions if needed.

Your output must strictly follow this JSON format, with no extra formatting or markdown:

{
"reply": "Your conversational response to the user here.",
"dietPlan": {
"dailyMeals": [
{
"day": "Monday",
"meals": [
{ "mealType": "Breakfast", "recipe": "Name", "calories": 300, "ingredients": ["item1"], "steps": ["step1"] },
{ "mealType": "Lunch", "recipe": "Name", "calories": 500, "ingredients": ["item1"], "steps": ["step1"] },
{ "mealType": "Dinner", "recipe": "Name", "calories": 400, "ingredients": ["item1"], "steps": ["step1"] }
]
}
// Repeat for Tuesday through Sunday
]
}
}

Never suggest non-Indian foods. All meals, ingredients, and recipes must be Indian-style.

Be mindful of the user’s health conditions, dietary preferences, and restrictions when generating the diet plan.
      User Message: "${userMessage}"
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    
    // Clean up response
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiData;
    try {
        aiData = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        // Fallback if JSON parsing fails
        aiData = {
            reply: text, // Use the raw text as reply if it's not JSON
            dietPlan: null
        };
    }

    const botReply = aiData.reply || "I'm here to help with your health.";

    // --- SAVE CHAT ---
    let chat = await ChatHistory.findOne({ userId, sessionId });
    if (!chat) {
      chat = new ChatHistory({ userId, sessionId, messages: [] });
    }
    chat.messages.push({ sender: "user", text: userMessage });
    chat.messages.push({ sender: "bot", text: botReply });
    await chat.save();

    // --- UPDATE DIET PLAN IF PROVIDED ---
    if (aiData.dietPlan && aiData.dietPlan.dailyMeals) {
      console.log("Updating diet plan for user:", userId);
      await DietPlan.findOneAndUpdate(
        { userId },
        { 
          userId, 
          dailyMeals: aiData.dietPlan.dailyMeals,
          weekNumber: 1 // Reset or manage week number as needed
        },
        { upsert: true, new: true }
      );
    }

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    const fallbackReply = "I’m here to help, but I couldn’t process your request right now. Please try again later.";
    // Save fallback chat
    let chat = await ChatHistory.findOne({ userId, sessionId });
    if (!chat) chat = new ChatHistory({ userId, sessionId, messages: [] });
    chat.messages.push({ sender: "user", text: userMessage });
    chat.messages.push({ sender: "bot", text: fallbackReply });
    await chat.save();
    res.json({ reply: fallbackReply });
  }
};


export const getChatHistory = async (req, res) => {
  const userId = req.user._id;
  const sessionId = req.query.sessionId || null;
  const limit = Number(req.query.limit) || 50;

  try {
    const chat = await ChatHistory.findOne({ userId, sessionId });
    if (!chat) return res.json({ messages: [] });

    res.json({ messages: chat.messages.slice(-limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};
