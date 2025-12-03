from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from agents.master_agent import MasterAgent

app = Flask(__name__)
app.secret_key = "super-secret-key-123"     # change for production
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Create agent once (model won't be reloaded on reset)
agent = MasterAgent()

def init_session():
    """Ensure canonical session keys exist."""
    if "customer_data" not in session:
        session["customer_data"] = {}
    if "loan_application" not in session:
        session["loan_application"] = {}
    if "conversation_state" not in session:
        session["conversation_state"] = None

@app.route("/chat", methods=["POST"])
def chat():
    init_session()
    data = request.get_json() or {}
    user_message = data.get("message", "")
    reply = agent.handle_input(user_message, session)
    session.modified = True
    return jsonify({"reply": reply})

@app.route("/upload", methods=["POST"])
def upload_file():
    init_session()

    if "file" not in request.files:
        return jsonify({"error": "no file uploaded"}), 400

    file = request.files["file"]
    doc_type = request.form.get("document_type", "unknown")

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    # pass filepath to agent (it expects a path for verification/extraction)
    reply = agent.handle_input(filepath, session)
    session.modified = True
    return jsonify({"path": filepath, "document_type": doc_type, "reply": reply})

@app.route("/reset", methods=["POST"])
def reset():
    # clear Flask session
    session.clear()
    # reset agent internal state without reloading model
    agent.reset()
    return jsonify({"status": "ok", "message": "Session and agent state cleared"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
