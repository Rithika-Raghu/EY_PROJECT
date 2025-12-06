from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api
import os

from agents.master_agent import MasterAgent

from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig

from database.models import *
from database.vector_store import ChromaDBStore

from backend.security import security, user_datastore
from backend.auth import Signup, Login


app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# Initialize CORS FIRST - before routes
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
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
    print("📌 Database tables created successfully!")

security.init_app(app, user_datastore)

vector_store = ChromaDBStore()
print("📌 ChromaDB vector store initialized")

agent = MasterAgent()

# rename session variable
chat_session = {"customer_data": {}, "loan_application": {}}


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    reply = agent.handle_input(data.get("message", ""), chat_session)
    return jsonify({"reply": reply})


@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    doc_type = request.form.get("document_type", "unknown")
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    reply = agent.handle_input(filepath, chat_session)

    return jsonify({
        "path": filepath,
        "document_type": doc_type,
        "reply": reply
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
