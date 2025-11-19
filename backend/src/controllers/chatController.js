import ChatHistory from "../models/ChatHistory.js";
import { getContext, getBotReplyWithTimeout, saveChatToDB } from "../utils/chatHelpers.js";

export const sendMessage = async (req, res) => {
  const userMessage = req.body.text;
  const sessionId = req.body.sessionId || null;
  const userId = req.user._id;

  if (!userMessage || userMessage.trim() === "") return res.status(400).json({ message: "Message cannot be empty" });

  try {
    const chat = await ChatHistory.findOne({ userId, sessionId });
    const context = getContext(chat);

    const botReply = await getBotReplyWithTimeout(userMessage, context, "http://your-model-server/infer");

    await saveChatToDB(userId, userMessage, botReply, sessionId);

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    const fallbackReply = "Sorry, I cannot answer that right now.";
    await saveChatToDB(userId, userMessage, fallbackReply, sessionId);
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
