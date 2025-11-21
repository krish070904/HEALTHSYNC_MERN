import api from "./api";

export const sendMessage = async (text, sessionId) => {
  try {
    const res = await api.post("/chat/send", { text, sessionId });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);
    return { reply: "Error connecting to server." };
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const res = await api.get(`/chat/history?sessionId=${sessionId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching history:", err);
    return { messages: [] };
  }
};
