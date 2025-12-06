from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


# ---------------------------------------------------------
# USERS TABLE
# ---------------------------------------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(20), default="customer")  # customer, admin, agent

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=True)

    # Relationship
    sessions = db.relationship("ChatSession", backref="user", lazy=True)
    loans = db.relationship("LoanApplication", backref="user", lazy=True)
    kycs = db.relationship("KYC", backref="user", lazy=True)
    tickets = db.relationship("SupportTicket", backref="user", lazy=True)

    # Password helpers
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# ---------------------------------------------------------
# CHAT SESSION TABLE (To link to ChromaDB)
# ---------------------------------------------------------
class ChatSession(db.Model):
    __tablename__ = "chat_sessions"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    agent_type = db.Column(db.String(50), default="sales_agent")  
    # sales_agent, support_agent, loan_advisor

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_interaction = db.Column(db.DateTime, default=datetime.utcnow)

    # Notice: Chat messages stored in ChromaDB. 
    # Only metadata stays in SQL DB.


# ---------------------------------------------------------
# LOAN APPLICATIONS
# ---------------------------------------------------------
class LoanApplication(db.Model):
    __tablename__ = "loan_applications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    purpose = db.Column(db.String(200))  
    amount = db.Column(db.Integer)
    tenure_months = db.Column(db.Integer)

    status = db.Column(db.String(20), default="pending")
    # pending, under_review, approved, rejected

    interest_rate = db.Column(db.Float)
    emi_amount = db.Column(db.Float)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------------------------------------
# KYC DETAILS
# ---------------------------------------------------------
class KYC(db.Model):
    __tablename__ = "kyc"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    document_type = db.Column(db.String(50))
    document_number = db.Column(db.String(100))
    document_image_url = db.Column(db.String(255))  # S3 or local path

    status = db.Column(db.String(20), default="pending")
    # pending, verified, rejected

    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified_at = db.Column(db.DateTime)


# ---------------------------------------------------------
# LOAN PRODUCTS
# ---------------------------------------------------------
class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    interest_rate = db.Column(db.Float)
    max_amount = db.Column(db.Integer)
    max_tenure = db.Column(db.Integer)

    description = db.Column(db.Text)

    active = db.Column(db.Boolean, default=True)


# ---------------------------------------------------------
# SUPPORT TICKETS
# ---------------------------------------------------------
class SupportTicket(db.Model):
    __tablename__ = "support_tickets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    subject = db.Column(db.String(255))
    message = db.Column(db.Text)

    status = db.Column(db.String(20), default="open")
    # open, in_progress, resolved, closed

    priority = db.Column(db.String(20), default="medium")
    # low, medium, high

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
