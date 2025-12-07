from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_restful import Api
import os
from flask_session import Session
from agents.master_agent import MasterAgent

from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig

from database.models import *
from database.vector_store import ChromaDBStore

from backend.security import security, user_datastore
from backend.auth import Signup, Login
import uuid


app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# Initialize CORS FIRST - before routes
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True   # ✅ Add this
    }
})

db.init_app(app)
api = Api(app)

# Add resources OUTSIDE app_context - this is critical!
api.add_resource(Signup, '/api/signup')
api.add_resource(Login, '/api/login')

# Database initialization inside app_context
with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(
        username="admin",
        email="admin@finomic.com",
        password=generate_password_hash("admin123"),
        role="admin"
    )

    db.session.add(admin)
    db.session.commit()

    print("Admin created")


security.init_app(app, user_datastore)

vector_store = ChromaDBStore()
print("📌 ChromaDB vector store initialized")

agent = MasterAgent()

# rename session variable
chat_session = {"customer_data": {}, "loan_application": {}}


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    # Get or create session ID
    session_id = session.get('chat_session_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        session['chat_session_id'] = session_id
        session['chat_history'] = []
        session.modified = True
    
    # Get chat history from session
    chat_history = session.get('chat_history', [])
    
    # Add user message to history
    chat_history.append({
        'role': 'user',
        'content': user_message,
        'timestamp': datetime.now().isoformat()
    })
    
    try:
        # Pass entire session data to agent (including history)
        full_session = {
            "chat_session_id": session_id,
            "customer_data": session.get('customer_data', {}),
            "loan_application": session.get('loan_application', {}),
            "chat_history": chat_history
        }
        
        reply = agent.handle_input(user_message, full_session)
        
        # Add bot response to history
        chat_history.append({
            'role': 'bot',
            'content': reply,
            'timestamp': datetime.now().isoformat()
        })
        
        # Limit history to last 20 messages to prevent memory issues
        if len(chat_history) > 20:
            chat_history = chat_history[-20:]
        
        # Update session
        session['chat_history'] = chat_history
        session.modified = True
        
        return jsonify({
            "reply": reply,
            "session_id": session_id,
            "history_count": len(chat_history)
        })
        
    except Exception as e:
        # Fallback response with error handling
        error_reply = "🔄 I'm temporarily unavailable. Common queries:\n• 'loan status'\n• 'EMI details'\n• 'KYC status'"
        chat_history.append({
            'role': 'bot',
            'content': error_reply,
            'timestamp': datetime.now().isoformat()
        })
        session['chat_history'] = chat_history
        session.modified = True
        
        return jsonify({
            "reply": error_reply,
            "session_id": session_id,
            "history_count": len(chat_history),
            "error": str(e)[:100]
        })

@app.route("/chat/history", methods=["GET"])
def get_chat_history():
    """Get full chat history for current session"""
    session_id = session.get('chat_session_id')
    chat_history = session.get('chat_history', [])
    
    return jsonify({
        "session_id": session_id,
        "history": chat_history,
        "total_messages": len(chat_history)
    })

@app.route("/chat/clear", methods=["POST"])
def clear_chat():
    """🚨 COMPLETE SESSION RESET - Clears ALL context"""
    # Clear Flask session completely
    session.clear()
    
    # Reset global chat_session (shared across requests)
    global chat_session
    chat_session = {"customer_data": {}, "loan_application": {}}
    
    print("🗑️ COMPLETE CHAT CONTEXT CLEARED - Fresh start!")
    
    return jsonify({
        "message": "Chat history & all context cleared. Fresh start!",
        "session_id": "reset"
    })
@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    doc_type = request.form.get("document_type", "unknown")
    filename = file.filename
    filepath = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    # Get session for context
    session_id = session.get('chat_session_id')
    chat_history = session.get('chat_history', [])
    
    full_session = {
        "chat_session_id": session_id,
        "customer_data": session.get('customer_data', {}),
        "loan_application": session.get('loan_application', {}),
        "chat_history": chat_history
    }
    
    try:
        reply = agent.handle_input(filepath, full_session)
        
        # Add to chat history
        chat_history.append({
            'role': 'user',
            'content': f"📎 Uploaded: {filename} ({doc_type})",
            'timestamp': datetime.now().isoformat()
        })
        chat_history.append({
            'role': 'bot',
            'content': reply,
            'timestamp': datetime.now().isoformat()
        })
        
        session['chat_history'] = chat_history[-20:]  # Keep last 20
        session.modified = True
        
        return jsonify({
            "path": filepath,
            "document_type": doc_type,
            "reply": reply,
            "session_id": session_id
        })
    except Exception as e:
        return jsonify({
            "path": filepath,
            "document_type": doc_type,
            "reply": f"Upload processed but agent error: {str(e)[:100]}",
            "session_id": session_id
        })

if __name__ == "__main__":
    app.run(debug=True, port=5000)



























# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_restful import Api
# import os

# from agents.master_agent import MasterAgent

# from flask_sqlalchemy import SQLAlchemy
# from config import DevelopmentConfig

# from database.models import *
# from database.vector_store import ChromaDBStore

# from backend.security import security, user_datastore
# from backend.auth import Signup, Login


# app = Flask(__name__)
# app.config.from_object(DevelopmentConfig)

# db.init_app(app)

# api = Api(app)     

# with app.app_context():
#     db.create_all()
#     print("📌 Database tables created successfully!")

#     api.add_resource(Login, '/api/login')
#     api.add_resource(Signup, '/api/signup')


# security.init_app(app, user_datastore)

# vector_store = ChromaDBStore()
# print("📌 ChromaDB vector store initialized")

# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# agent = MasterAgent()

# # rename session variable
# chat_session = {"customer_data": {}, "loan_application": {}}


# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.get_json()
#     reply = agent.handle_input(data.get("message", ""), chat_session)
#     return jsonify({"reply": reply})


# @app.route("/upload", methods=["POST"])
# def upload_file():
#     file = request.files["file"]
#     doc_type = request.form.get("document_type", "unknown")
#     filepath = os.path.join("uploads", file.filename)
#     file.save(filepath)

#     reply = agent.handle_input(filepath, chat_session)

#     return jsonify({
#         "path": filepath,
#         "document_type": doc_type,
#         "reply": reply
#     })


# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
