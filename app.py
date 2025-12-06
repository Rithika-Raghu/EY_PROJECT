from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from agents.master_agent import MasterAgent
from flask import session
from database.models import *
from config import DevelopmentConfig
from database.vector_store import ChromaDBStore

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)

with app.app_context():
    db.create_all()
    print("📌 Database tables created successfully!")

vector_store = ChromaDBStore()
print("📌 ChromaDB vector store initialized")

CORS(app)

agent = MasterAgent()

session = {"customer_data": {}, "loan_application": {}} 
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "") 
    reply = agent.handle_input(user_message, session) 
    return jsonify({"reply": reply})


@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    doc_type = request.form.get("document_type", "unknown")
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    # Call MasterAgent directly
    reply = agent.handle_input(filepath, session)

    return jsonify({
        "path": filepath,
        "document_type": doc_type,
        "reply": reply
    })





if __name__ == "__main__":
    app.run(debug=True, port=5000)
