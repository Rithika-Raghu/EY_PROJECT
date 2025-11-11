import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! Please enter your name to begin your loan application." },
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input || file.name }]);

    let data;

    try {
      // ✅ File upload flow
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // Upload file to backend
        const uploadRes = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        // Use reply directly from /upload
        data = uploadData;
        setFile(null);
      } 
      // ✅ Normal text message flow
      else {
        const chatRes = await fetch("http://127.0.0.1:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        data = await chatRes.json();
        setInput("");
      }

      // ✅ Display bot reply
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong while connecting to the server." },
      ]);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h3>🤖 SmartLoan AI</h3>
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          background: "#fafafa",
          padding: "10px",
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
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "70%", padding: "8px" }}
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginLeft: "5px" }}
      />
      <button
        onClick={sendMessage}
        style={{ marginLeft: "5px", padding: "8px 12px" }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
