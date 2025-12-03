import React from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages }) {
  return (
    <div
      className="
        flex-1 
        overflow-y-auto 
        mb-4 
        bg-white 
        rounded-lg 
        p-4 
        shadow 
        space-y-3
      "
    >
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          sender={msg.sender}
          text={msg.text}
        />
      ))}
    </div>
  );
}
