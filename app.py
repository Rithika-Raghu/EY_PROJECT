from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_restful import Api
import os
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash

from agents.master_agent import MasterAgent

from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig

from database.models import db, User
from database.vector_store import ChromaDBStore

from backend.security import security, user_datastore
from backend.auth import Signup, Login, SendOTP


app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# ✅ CRITICAL: Override SQLAlchemy database to use same SQLite file as loan system
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loan_system.db'
# app.config['SQLALCHEMY_BINDS'] = {
#     'loan_db': 'sqlite:///loan_system.db'  # Both use same database
# }
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'loan_system.db')  # One level up from backend/

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Session configuration for Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on filesystem
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour

# Initialize CORS FIRST - before routes
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Initialize database
db.init_app(app)
api = Api(app)

# Add resources OUTSIDE app_context
api.add_resource(Signup, '/api/signup')
api.add_resource(Login, '/api/login')
api.add_resource(SendOTP, '/api/send-otp')

# ✅ Initialize MasterAgent (which creates loan tables in loan_system.db)
print("🔄 Initializing Master Agent and Loan Database...")
agent = MasterAgent()

# Database initialization inside app_context
with app.app_context():
    # ✅ Create Flask-SQLAlchemy tables (User, etc.) in same database
    db.create_all()
    
    # Check if admin already exists
    existing_admin = User.query.filter_by(username="admin").first()
    
    if not existing_admin:
        admin = User(
            username="admin",
            email="admin@finomic.com",
            password=generate_password_hash("admin123"),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin user created: username='admin', password='admin123'")
    else:
        print("✅ Admin user already exists")

# Initialize security
security.init_app(app, user_datastore)

# Initialize vector store
vector_store = ChromaDBStore()
print("📌 ChromaDB vector store initialized")

# Global session storage (for chatbot state)
chat_sessions = {}


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    # Get or create session ID
    session_id = session.get('chat_session_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        session['chat_session_id'] = session_id
        session.modified = True
    
    # Initialize session storage if not exists
    if session_id not in chat_sessions:
        chat_sessions[session_id] = {
            "customer_data": {},
            "loan_application": {},
            "chat_history": []
        }
    
    # Get current session data
    current_session = chat_sessions[session_id]
    chat_history = current_session.get('chat_history', [])
    
    # Add user message to history
    chat_history.append({
        'role': 'user',
        'content': user_message,
        'timestamp': datetime.now().isoformat()
    })
    
    try:
        # Pass session data to agent
        reply = agent.handle_input(user_message, current_session)
        
        # Add bot response to history
        chat_history.append({
            'role': 'bot',
            'content': reply,
            'timestamp': datetime.now().isoformat()
        })
        
        # Limit history to last 20 messages
        if len(chat_history) > 20:
            chat_history = chat_history[-20:]
        
        # Update session storage
        current_session['chat_history'] = chat_history
        chat_sessions[session_id] = current_session
        
        return jsonify({
            "reply": reply,
            "session_id": session_id,
            "history_count": len(chat_history),
            "active_stage": agent.current_stage,
            "active_worker": agent.active_worker
        })
        
    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
        # Fallback response with error handling
        error_reply = (
            "🔄 I encountered an issue. Let me help you:\n"
            "• Type 'reset' to start fresh\n"
            "• Check if your phone number is valid\n"
            "• Ensure documents are in PDF format"
        )
        chat_history.append({
            'role': 'bot',
            'content': error_reply,
            'timestamp': datetime.now().isoformat()
        })
        current_session['chat_history'] = chat_history
        chat_sessions[session_id] = current_session
        
        return jsonify({
            "reply": error_reply,
            "session_id": session_id,
            "history_count": len(chat_history),
            "error": str(e)[:200]
        }), 500


@app.route("/chat/history", methods=["GET"])
def get_chat_history():
    """Get full chat history for current session"""
    session_id = session.get('chat_session_id')
    
    if not session_id or session_id not in chat_sessions:
        return jsonify({
            "session_id": None,
            "history": [],
            "total_messages": 0
        })
    
    current_session = chat_sessions[session_id]
    chat_history = current_session.get('chat_history', [])
    
    return jsonify({
        "session_id": session_id,
        "history": chat_history,
        "total_messages": len(chat_history),
        "customer_data": current_session.get('customer_data', {}),
        "loan_application": current_session.get('loan_application', {})
    })


@app.route("/chat/clear", methods=["POST"])
def clear_chat():
    """🚨 COMPLETE SESSION RESET - Clears ALL context"""
    session_id = session.get('chat_session_id')
    
    # Clear session storage
    if session_id and session_id in chat_sessions:
        del chat_sessions[session_id]
    
    # Clear Flask session
    session.clear()
    
    # Reset agent conversation state
    agent.reset_conversation()
    
    print("🗑️ COMPLETE CHAT CONTEXT CLEARED - Fresh start!")
    
    return jsonify({
        "message": "Chat history & all context cleared. Fresh start!",
        "status": "reset"
    })


@app.route("/upload", methods=["POST"])
def upload_file():
    """Handle document uploads (PAN, Aadhaar, Salary Slip)"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    doc_type = request.form.get("document_type", "unknown")
    print(file)
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Save file
    filename = file.filename
    filepath = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)
    

    # Get session
    session_id = session.get('chat_session_id')
    print(session_id)
    if not session_id or session_id not in chat_sessions:
        return jsonify({
            "error": "No active chat session. Please start a conversation first."
        }), 400
    
    current_session = chat_sessions[session_id]
    chat_history = current_session.get('chat_history', [])
    
    try:
        # Pass filepath to agent
        reply = agent.handle_input(filepath, current_session)
        
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
        
        current_session['chat_history'] = chat_history[-20:]
        chat_sessions[session_id] = current_session
        
        return jsonify({
            "path": filepath,
            "filename": filename,
            "document_type": doc_type,
            "reply": reply,
            "session_id": session_id,
            "success": True
        })
        
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        error_reply = f"⚠️ Error processing {doc_type}: {str(e)[:100]}"
        
        chat_history.append({
            'role': 'bot',
            'content': error_reply,
            'timestamp': datetime.now().isoformat()
        })
        current_session['chat_history'] = chat_history
        chat_sessions[session_id] = current_session
        
        return jsonify({
            "path": filepath,
            "filename": filename,
            "document_type": doc_type,
            "reply": error_reply,
            "session_id": session_id,
            "success": False,
            "error": str(e)[:200]
        }), 500


@app.route("/customers", methods=["GET"])
def get_customers():
    """Get all customers from loan database (for testing/admin)"""
    try:
        # Query directly from loan database
        customers = agent.db.conn.execute(
            "SELECT phone, name, city, credit_score, pre_approved_limit FROM customers"
        ).fetchall()
        
        customer_list = [
            {
                "phone": c[0],
                "name": c[1],
                "city": c[2],
                "credit_score": c[3],
                "pre_approved_limit": c[4]
            }
            for c in customers
        ]
        
        return jsonify({
            "customers": customer_list,
            "total": len(customer_list)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/loan-applications", methods=["GET"])
def get_loan_applications():
    """Get all loan applications (for testing/admin)"""
    try:
        applications = agent.db.conn.execute(
            "SELECT * FROM loan_applications ORDER BY created_at DESC"
        ).fetchall()
        
        app_list = [
            {
                "id": a[0],
                "customer_phone": a[1],
                "amount": a[2],
                "tenure": a[3],
                "purpose": a[4],
                "interest_rate": a[5],
                "emi": a[6],
                "status": a[7],
                "created_at": a[8]
            }
            for a in applications
        ]
        
        return jsonify({
            "applications": app_list,
            "total": len(app_list)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "database": "loan_system.db",
        "agent_status": agent.current_stage,
        "active_sessions": len(chat_sessions)
    })


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Tata Capital SmartLoan API Server")
    print("="*60)
    print("📊 Database: loan_system.db (shared)")
    print("👤 Admin: username='admin', password='admin123'")
    print("🌐 API Endpoints:")
    print("   POST /chat - Chat with loan assistant")
    print("   POST /upload - Upload documents")
    print("   GET  /customers - View all customers")
    print("   GET  /loan-applications - View all applications")
    print("   POST /api/login - User login")
    print("   POST /api/signup - User registration")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
