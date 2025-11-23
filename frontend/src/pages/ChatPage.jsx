import React, { useEffect, useState, useRef } from "react";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessage from "../components/Chat/ChatMessage";
import ChatInput from "../components/Chat/ChatInput";
import QuickActions from "../components/Chat/QuickAction";
import { getChatHistory, sendMessage } from "../services/chatService.js";
import "../styles/ChatPageBackground.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(Date.now().toString());
  const bottomRef = useRef(null);

  useEffect(() => {
    async function fetchHistory() {
      const res = await getChatHistory(sessionId);
      setMessages(res.messages || []);
    }
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = { sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const res = await sendMessage(text, sessionId);
    const botMsg = { sender: "bot", text: res.reply, timestamp: new Date() };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleClear = () => setMessages([]);

  return (
    <div className="relative flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-background-dark shadow-lg">
      <div className="bubbles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{ left: `${Math.random() * 100}vw`, animationDelay: `${Math.random() * 5}s` }}
          />
        ))}
      </div>
      <ChatHeader onClear={handleClear} />
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </main>
      <QuickActions onAction={handleSend} />
      <footer className="p-4 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 shrink-0">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  );
}
