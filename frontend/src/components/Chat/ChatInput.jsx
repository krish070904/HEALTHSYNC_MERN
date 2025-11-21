import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-3">
      <button className="flex-shrink-0 flex items-center justify-center size-10 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
      <input
        type="text"
        className="flex-1 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-full px-5 py-2.5 text-sm placeholder:text-gray-500"
        placeholder="Type your health question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="flex-shrink-0 flex items-center justify-center size-10 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
        <span className="material-symbols-outlined text-2xl">mic</span>
      </button>
      <button onClick={handleSend} className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-primary text-[#181511] hover:opacity-90 transition-opacity">
        <span className="material-symbols-outlined text-2xl">send</span>
      </button>
    </div>
  );
}
