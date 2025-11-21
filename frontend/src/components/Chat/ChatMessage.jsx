import React from "react";

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div
          className="w-10 h-10 shrink-0 rounded-full bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-9nTDg9ztznhzElafcvGQEPopF1rUsD32P6Vvao2nfj8k66zZ8KYSPukaqRYVAE1Q-nH_XPqMRyKbuIlvSOpM3Gbt6mfEH2fKSk3zrZXqNWcG9VTRO7eSLcaj8p0JB_ffV2JgMeiZVCccyZjGIAWCc9J9Lr-plYy6UAXQrQ-GK9wojXw_j8mhLX0pbtUcrQ1DoO0aUrXXXj541R_D62sA0OLDbBTH_5mlXJkMaI8xeEJNK7mA5MpwSZ3hhMBBhOwkrhI8JYWFqSlU")`,
          }}
        />
      )}

      {/* Message Bubble */}
      <div className="flex flex-col gap-1 items-start">
        <p
          className={`text-sm font-normal flex max-w-md px-4 py-3 rounded-t-xl ${
            isUser ? "bg-user-message-bg rounded-bl-xl" : "bg-ai-message-bg rounded-br-xl"
          }`}
        >
          {message.text}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
