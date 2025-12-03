import React, { useState, useEffect } from "react";

function App() {
  // ✅ Load stored messages from localStorage when app loads
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "👋 Hi! Please enter your name to begin your loan application.",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input || file.name },
    ]);

    let data;

    try {
      // -------------------------
      // 📌 File upload flow
      // -------------------------
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        data = uploadData;
        setFile(null);
      }

      // -------------------------
      // 📌 Normal text message flow
      // -------------------------
      else {
        const chatRes = await fetch("http://127.0.0.1:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });

        data = await chatRes.json();
        setInput("");
      }

      // Add bot message
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong while connecting to the server.",
        },
      ]);
    }
  };

  // ✅ NEW — Clear Chat button logic
const clearChat = async () => {
  // 1) Clear backend session
  await fetch("http://127.0.0.1:5000/reset", {
    method: "POST",
  });

  // 2) Clear frontend chat
  localStorage.removeItem("chatHistory");

  setMessages([
    {
      sender: "bot",
      text: "👋 Chat cleared! Start fresh by entering your name.",
    },
  ]);
};

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        background: "white",
      }}
    >
      {/* Header */}
      <h3
        style={{
          marginBottom: "15px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        🤖 SmartLoan AI
      </h3>

      {/* Clear Chat Button */}
      <button
        onClick={clearChat}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          marginBottom: "10px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        🗑️ Clear Chat
      </button>

      {/* Message window */}
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          marginBottom: "15px",
          background: "#fafafa",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #eee",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: msg.sender === "user" ? "#007bff" : "#e4e6eb",
                color: msg.sender === "user" ? "white" : "black",
                borderRadius: "10px",
                padding: "8px 12px",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            width: "60%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginLeft: "5px" }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "5px",
            padding: "8px 12px",
            borderRadius: "6px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
