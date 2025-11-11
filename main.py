# main.py - Complete FastAPI Backend for SmartLoan AI
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
from datetime import datetime
import json
import os
import re
import random
from enum import Enum

# Initialize FastAPI
app = FastAPI(
    title="SmartLoan AI - NBFC Loan Assistant",
    version="2.0.0",
    description="Agentic AI-powered loan application system with Master-Worker architecture"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class MessageRequest(BaseModel):
    message: str
    session_id: str
    customer_id: Optional[str] = None
    language: Optional[str] = "en"

class MessageResponse(BaseModel):
    response: str
    agent: str
    sentiment: str
    next_action: Optional[str] = None
    data: Optional[Dict] = None

class CustomerData(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    purpose: Optional[str] = None
    monthly_salary: Optional[float] = None

class LoanApplication(BaseModel):
    customer_id: str
    amount: float
    tenure: int
    purpose: str
    credit_score: Optional[int] = None
    status: Optional[str] = "pending"

class DashboardStats(BaseModel):
    total_applications: int
    approved: int
    pending: int
    rejected: int
    conversion_rate: float
    avg_loan_amount: float

# ============================================================================
# IN-MEMORY STORAGE (Use Redis/Database in Production)
# ============================================================================

sessions = {}
applications = {}
notifications_store = []

# ============================================================================
# SYNTHETIC DATA - 10 CUSTOMERS
# ============================================================================

CUSTOMER_DATABASE = {
    "9876543210": {
        "name": "Rahul Sharma",
        "email": "rahul.sharma@email.com",
        "credit_score": 785,
        "pre_approved_limit": 500000,
        "monthly_income": 85000,
        "existing_loans": [{"type": "Car Loan", "emi": 12000}]
    },
    "9876543211": {
        "name": "Priya Patel",
        "email": "priya.patel@email.com",
        "credit_score": 820,
        "pre_approved_limit": 750000,
        "monthly_income": 120000,
        "existing_loans": []
    },
    "9876543212": {
        "name": "Amit Kumar",
        "email": "amit.kumar@email.com",
        "credit_score": 690,
        "pre_approved_limit": 300000,
        "monthly_income": 65000,
        "existing_loans": [{"type": "Personal Loan", "emi": 8000}]
    },
    "9876543213": {
        "name": "Sneha Singh",
        "email": "sneha.singh@email.com",
        "credit_score": 750,
        "pre_approved_limit": 600000,
        "monthly_income": 75000,
        "existing_loans": [{"type": "Home Loan", "emi": 18000}]
    },
    "9876543214": {
        "name": "Vijay Reddy",
        "email": "vijay.reddy@email.com",
        "credit_score": 680,
        "pre_approved_limit": 250000,
        "monthly_income": 95000,
        "existing_loans": [{"type": "Car Loan", "emi": 15000}]
    },
    "9876543215": {
        "name": "Anita Desai",
        "email": "anita.desai@email.com",
        "credit_score": 800,
        "pre_approved_limit": 700000,
        "monthly_income": 90000,
        "existing_loans": []
    },
    "9876543216": {
        "name": "Rajesh Gupta",
        "email": "rajesh.gupta@email.com",
        "credit_score": 720,
        "pre_approved_limit": 450000,
        "monthly_income": 55000,
        "existing_loans": [{"type": "Education Loan", "emi": 6000}]
    },
    "9876543217": {
        "name": "Meera Iyer",
        "email": "meera.iyer@email.com",
        "credit_score": 650,
        "pre_approved_limit": 200000,
        "monthly_income": 48000,
        "existing_loans": [{"type": "Two Wheeler", "emi": 3000}]
    },
    "9876543218": {
        "name": "Karan Mehta",
        "email": "karan.mehta@email.com",
        "credit_score": 790,
        "pre_approved_limit": 650000,
        "monthly_income": 78000,
        "existing_loans": []
    },
    "9876543219": {
        "name": "Pooja Nair",
        "email": "pooja.nair@email.com",
        "credit_score": 760,
        "pre_approved_limit": 550000,
        "monthly_income": 62000,
        "existing_loans": [{"type": "Personal Loan", "emi": 7000}]
    }
}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def calculate_emi(principal: float, tenure: int, rate: float = 10.5) -> int:
    """Calculate monthly EMI"""
    monthly_rate = rate / 12 / 100
    emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
    return int(emi)

def analyze_sentiment(text: str) -> str:
    """Simple sentiment analysis"""
    text_lower = text.lower()
    positive_words = ['great', 'good', 'excellent', 'perfect', 'yes', 'sure', 'definitely', 'thanks', 'happy']
    negative_words = ['no', 'bad', 'worst', 'terrible', 'cancel', 'stop', 'angry', 'frustrated']
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    return 'neutral'

def extract_name(message: str) -> Optional[str]:
    """Extract name from message"""
    words = message.split()
    potential_names = [w for w in words if w[0].isupper() and len(w) > 2]
    
    if potential_names:
        return " ".join(potential_names[:2])
    
    if len(words) <= 3:
        return message.strip()
    
    return None

def extract_amount(message: str) -> Optional[int]:
    """Extract loan amount from message"""
    amount_match = re.findall(r'\d+', message.replace(',', ''))
    if amount_match:
        return int(''.join(amount_match))
    return None

def extract_tenure(message: str) -> Optional[int]:
    """Extract tenure from message"""
    tenure_match = re.findall(r'\d+', message)
    if tenure_match:
        return int(tenure_match[0])
    return None

def get_credit_score(phone: str) -> int:
    """Get credit score from database"""
    if phone in CUSTOMER_DATABASE:
        return CUSTOMER_DATABASE[phone]["credit_score"]
    return random.randint(650, 850)

def get_pre_approved_limit(phone: str) -> int:
    """Get pre-approved limit"""
    if phone in CUSTOMER_DATABASE:
        return CUSTOMER_DATABASE[phone]["pre_approved_limit"]
    return 300000

def translate_text(text: str, language: str) -> str:
    """Simple translation (use proper API in production)"""
    if language == "hi":
        translations = {
            "Welcome": "स्वागत है",
            "Thank you": "धन्यवाद",
            "Approved": "स्वीकृत"
        }
    elif language == "mr":
        translations = {
            "Welcome": "स्वागत आहे",
            "Thank you": "धन्यवाद",
            "Approved": "मंजूर"
        }
    else:
        return text
    
    for eng, trans in translations.items():
        text = text.replace(eng, trans)
    
    return text

# ============================================================================
# AGENT IMPLEMENTATIONS
# ============================================================================

class MasterAgent:
    """Master Agent - Orchestrator"""
    
    @staticmethod
    def greet_customer(message: str, session: Dict) -> str:
        if not session["customer_data"].get("name"):
            name = extract_name(message)
            if name:
                session["customer_data"]["name"] = name
                return f"Great to meet you, {name}! 😊 I see you're interested in a personal loan. To help you better, could you tell me what you need this loan for? (Home renovation, education, wedding, debt consolidation, or something else?)"
            return "Welcome to SmartLoan AI! I'm your personal loan assistant. May I know your name?"
        return "How can I help you with your loan today?"
    
    @staticmethod
    def confirm_sanction(session: Dict) -> str:
        loan_app = session["loan_application"]
        customer = session["customer_data"]
        emi = calculate_emi(loan_app['amount'], loan_app['tenure'])
        
        return f"""🎉 Excellent decision, {customer['name']}! 

I'm now generating your official sanction letter with the following details:

📋 Loan Details:
• Amount: ₹{loan_app['amount']:,}
• Tenure: {loan_app['tenure']} months
• Interest Rate: 10.5% p.a.
• Estimated EMI: ₹{emi:,}

Your sanction letter will be ready in a moment... ⏳"""

class SalesAgent:
    """Sales Agent - Negotiations"""
    
    @staticmethod
    def assess_needs(message: str) -> str:
        purpose = message.strip().lower()
        
        responses = {
            "home": "Home renovation is a wonderful investment! 🏠 A personal loan can help you transform your living space.",
            "education": "Education is the best investment! 📚 We offer competitive rates for education loans.",
            "wedding": "Congratulations on the upcoming wedding! 💒 Let's make it memorable without financial stress.",
            "business": "Business expansion is exciting! 💼 A personal loan can fuel your entrepreneurial dreams.",
            "medical": "Health is wealth! 🏥 We understand the urgency and will expedite your application.",
            "debt": "Smart move! Consolidating debt can save you money on interest. 💰"
        }
        
        for key, response in responses.items():
            if key in purpose:
                return f"{response}\n\nHow much loan amount are you looking for? Please share your preferred amount."
        
        return f"Great! {message} is an important goal. 💰 How much loan amount would you need to achieve this? Please share your preferred amount."
    
    @staticmethod
    def discuss_amount(message: str, amount: int) -> str:
        if amount < 50000:
            return f"I see you need ₹{amount:,}. For small amounts, we have instant approval! What loan tenure would be comfortable for you? (12, 24, 36, 48, or 60 months)"
        elif amount > 1000000:
            return f"₹{amount:,} is a significant amount. We can definitely help! What tenure works for you?"
        else:
            return f"Perfect! ₹{amount:,} is noted. Now, what loan tenure would be comfortable for you? We offer flexible tenures: 12, 24, 36, 48, or 60 months. Longer tenure means lower EMI!"
    
    @staticmethod
    def discuss_tenure(amount: int, tenure: int) -> str:
        emi = calculate_emi(amount, tenure)
        
        return f"""Excellent choice! Here's your loan summary:

💰 Loan Amount: ₹{amount:,}
📅 Tenure: {tenure} months
💳 Estimated EMI: ₹{emi:,}/month
📊 Interest Rate: 10.5% p.a.
💵 Total Payable: ₹{emi * tenure:,}

Now, let me quickly verify your details for KYC. Could you please share your registered mobile number?"""

class VerificationAgent:
    """Verification Agent - KYC"""
    
    @staticmethod
    def verify_phone(phone: str) -> tuple:
        phone_clean = re.sub(r'\D', '', phone)
        
        if len(phone_clean) == 10:
            return ("✅ Phone number verified successfully! Now, please provide your complete address for KYC verification.", True)
        return ("Please provide a valid 10-digit mobile number.", False)
    
    @staticmethod
    def verify_address(address: str) -> tuple:
        if len(address) > 20:
            return ("""✅ KYC verification completed successfully! 

Now let me check your credit eligibility and pre-approved offers. This will just take a moment... 🔍""", True)
        return ("Please provide your complete address including city and pin code.", False)

class UnderwritingAgent:
    """Underwriting Agent - Credit Assessment"""
    
    @staticmethod
    def evaluate_application(customer_data: Dict, loan_application: Dict) -> Dict:
        phone = customer_data.get("phone", "")
        credit_score = get_credit_score(phone)
        pre_approved_limit = get_pre_approved_limit(phone)
        requested_amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 12)
        
        # Credit score check
        if credit_score < 700:
            return {
                "status": "rejected",
                "reason": "credit_score_low",
                "message": f"""❌ Credit Assessment Results:

• Credit Score: {credit_score}/900 (Below threshold)
• Required Score: 700+
• Status: Application Declined

We're unable to approve your loan at this time due to credit score requirements.""",
                "credit_score": credit_score
            }
        
        # Eligibility logic
        if requested_amount <= pre_approved_limit:
            # Instant approval
            emi = calculate_emi(requested_amount, tenure)
            return {
                "status": "approved",
                "approval_type": "instant",
                "message": f"""✅ LOAN APPROVED! Congratulations! 🎉

📊 Credit Assessment Results:
• Credit Score: {credit_score}/900 ✅
• Pre-approved Limit: ₹{pre_approved_limit:,}
• Requested Amount: ₹{requested_amount:,} ✅
• Approval Status: INSTANT APPROVAL

💰 Your Loan Details:
• Loan Amount: ₹{requested_amount:,}
• Tenure: {tenure} months
• Interest Rate: 10.5% p.a.
• Monthly EMI: ₹{emi:,}
• Processing Fee: ₹{int(requested_amount * 0.02):,} (2%)

Would you like to proceed with generating your sanction letter? Type 'Yes' to continue! 🎊""",
                "credit_score": credit_score,
                "emi": emi
            }
        
        elif requested_amount <= (pre_approved_limit * 2):
            # Requires salary slip
            return {
                "status": "requires_documents",
                "documents_needed": ["salary_slip"],
                "message": f"""📋 Credit Assessment Results:

• Credit Score: {credit_score}/900 ✅
• Pre-approved Limit: ₹{pre_approved_limit:,}
• Requested Amount: ₹{requested_amount:,}
• Status: CONDITIONAL APPROVAL

Your credit score is excellent! However, for amounts above your pre-approved limit, we need to verify your income.

📎 Please upload your latest salary slip to proceed.""",
                "credit_score": credit_score
            }
        
        else:
            # Exceeds limit
            return {
                "status": "rejected",
                "reason": "amount_exceeded",
                "message": f"""⚠️ Credit Assessment Results:

• Credit Score: {credit_score}/900 ✅
• Pre-approved Limit: ₹{pre_approved_limit:,}
• Requested Amount: ₹{requested_amount:,}
• Status: Amount Exceeds Eligibility

The requested amount is above your pre-approved limit. Would you like to proceed with ₹{pre_approved_limit:,}?""",
                "credit_score": credit_score,
                "max_eligible": pre_approved_limit
            }

class SanctionLetterAgent:
    """Sanction Letter Generator"""
    
    @staticmethod
    def generate_letter(customer_data: Dict, loan_application: Dict) -> Dict:
        app_id = f"SL{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return {
            "status": "success",
            "message": f"""✅ Sanction Letter Generated Successfully! 🎊

Your loan has been officially sanctioned!

📄 Sanction Letter Details:
• Application ID: {app_id}
• Loan Amount: ₹{loan_application['amount']:,}
• Tenure: {loan_application['tenure']} months
• Document Status: Ready for Download

🎯 Next Steps:
1. Download your sanction letter
2. Our relationship manager will contact you within 24 hours
3. Complete documentation process
4. Receive loan disbursement in 48-72 hours

Thank you for choosing SmartLoan AI! 🙏""",
            "application_id": app_id
        }

# ============================================================================
# API ROUTES
# ============================================================================

@app.get("/")
async def root():
    return {
        "message": "SmartLoan AI - Agentic NBFC Loan Assistant",
        "version": "2.0.0",
        "status": "active",
        "endpoints": {
            "chat": "/api/chat",
            "dashboard": "/api/dashboard/stats",
            "docs": "/docs"
        }
    }

@app.post("/api/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    """Main chat endpoint - Master Agent orchestrates the conversation"""
    try:
        session_id = request.session_id
        
        # Initialize session if new
        if session_id not in sessions:
            sessions[session_id] = {
                "stage": "initial",
                "customer_data": {},
                "loan_application": {},
                "history": [],
                "created_at": datetime.now().isoformat()
            }
        
        session = sessions[session_id]
        session["history"].append({
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Analyze sentiment
        sentiment = analyze_sentiment(request.message)
        
        # Master Agent decides which worker agent to invoke
        current_stage = session["stage"]
        response_data = {}
        agent_name = "Master Agent"
        
        if current_stage == "initial":
            response = MasterAgent.greet_customer(request.message, session)
            if "name" in session["customer_data"]:
                session["stage"] = "need_assessment"
                
        elif current_stage == "need_assessment":
            response = SalesAgent.assess_needs(request.message)
            agent_name = "Sales Agent"
            session["customer_data"]["purpose"] = request.message
            session["stage"] = "loan_amount"
            
        elif current_stage == "loan_amount":
            amount = extract_amount(request.message)
            if amount:
                session["loan_application"]["amount"] = amount
                response = SalesAgent.discuss_amount(request.message, amount)
                agent_name = "Sales Agent"
                session["stage"] = "tenure"
            else:
                response = "Could you please specify the loan amount in numbers? For example: 500000 or 5 lakhs"
                agent_name = "Sales Agent"
                
        elif current_stage == "tenure":
            tenure = extract_tenure(request.message)
            if tenure and tenure in [12, 24, 36, 48, 60]:
                session["loan_application"]["tenure"] = tenure
                amount = session["loan_application"]["amount"]
                response = SalesAgent.discuss_tenure(amount, tenure)
                agent_name = "Sales Agent"
                session["stage"] = "verification"
            else:
                response = "Please specify the tenure in months (12, 24, 36, 48, or 60 months)"
                agent_name = "Sales Agent"
                
        elif current_stage == "verification":
            if "phone" not in session["customer_data"]:
                response, verified = VerificationAgent.verify_phone(request.message)
                agent_name = "Verification Agent"
                if verified:
                    session["customer_data"]["phone"] = re.sub(r'\D', '', request.message)
            elif "address" not in session["customer_data"]:
                response, verified = VerificationAgent.verify_address(request.message)
                agent_name = "Verification Agent"
                if verified:
                    session["customer_data"]["address"] = request.message
                    session["stage"] = "underwriting"
                    
        elif current_stage == "underwriting":
            result = UnderwritingAgent.evaluate_application(
                session["customer_data"],
                session["loan_application"]
            )
            agent_name = "Underwriting Agent"
            response = result["message"]
            response_data = result
            
            if result["status"] == "approved":
                session["stage"] = "sanction_confirmation"
                session["loan_application"]["status"] = "approved"
            elif result["status"] == "requires_documents":
                session["stage"] = "document_upload"
            else:
                session["stage"] = "rejected"
                
        elif current_stage == "sanction_confirmation":
            if any(word in request.message.lower() for word in ["yes", "proceed", "confirm"]):
                response = MasterAgent.confirm_sanction(session)
                session["stage"] = "generate_sanction"
                response_data["action"] = "generate_sanction"
            else:
                response = "I understand. Would you like to make any changes to your loan application?"
                
        elif current_stage == "generate_sanction":
            sanction_result = SanctionLetterAgent.generate_letter(
                session["customer_data"],
                session["loan_application"]
            )
            response = sanction_result["message"]
            agent_name = "Sanction Letter Generator"
            response_data = sanction_result
            session["stage"] = "completed"
            
            # Store application
            app_id = sanction_result.get("application_id")
            if app_id:
                applications[app_id] = {
                    **session["customer_data"],
                    **session["loan_application"],
                    "status": "approved",
                    "created_at": datetime.now().isoformat()
                }
                
        else:
            response = "I'm here to help! How can I assist you today?"
        
        # Add response to history
        session["history"].append({
            "role": "assistant",
            "content": response,
            "agent": agent_name,
            "timestamp": datetime.now().isoformat()
        })
        
        # Translate if needed
        if request.language != "en":
            response = translate_text(response, request.language)
        
        return MessageResponse(
            response=response,
            agent=agent_name,
            sentiment=sentiment,
            next_action=response_data.get("action"),
            data=response_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get real-time dashboard statistics"""
    try:
        total = len(applications)
        approved = sum(1 for app in applications.values() if app.get("status") == "approved")
        pending = sum(1 for app in applications.values() if app.get("status") == "pending")
        rejected = sum(1 for app in applications.values() if app.get("status") == "rejected")
        
        conversion_rate = (approved / total * 100) if total > 0 else 0
        
        approved_apps = [app for app in applications.values() if app.get("status") == "approved"]
        avg_amount = sum(app.get("amount", 0) for app in approved_apps) / len(approved_apps) if approved_apps else 0
        
        # Add some synthetic data if empty
        if total == 0:
            return DashboardStats(
                total_applications=245,
                approved=187,
                pending=38,
                rejected=20,
                conversion_rate=76.3,
                avg_loan_amount=425000
            )
        
        return DashboardStats(
            total_applications=total,
            approved=approved,
            pending=pending,
            rejected=rejected,
            conversion_rate=round(conversion_rate, 2),
            avg_loan_amount=round(avg_amount, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions/{session_id}/history")
async def get_conversation_history(session_id: str):
    """Get complete conversation history"""
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "session_id": session_id,
            "history": sessions[session_id]["history"],
            "customer_data": sessions[session_id]["customer_data"],
            "loan_application": sessions[session_id]["loan_application"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/customer-insights/{session_id}")
async def get_customer_insights(session_id: str):
    """Get AI-powered customer insights"""
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = sessions[session_id]
        
        # Analyze sentiment trend
        sentiments = [analyze_sentiment(msg["content"]) 
                     for msg in session["history"] if msg["role"] == "user"]
        
        positive_count = sentiments.count('positive')
        total = len(sentiments) if sentiments else 1
        engagement_score = int((positive_count / total) * 100)
        
        return {
            "customer_profile": session["customer_data"],
            "sentiment_analysis": {
                "trend": "positive" if engagement_score > 60 else "neutral",
                "score": engagement_score
            },
            "engagement_score": engagement_score,
            "conversation_summary": f"Customer engaged in {len(session['history'])} messages"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-salary-slip")
async def upload_salary_slip(
    session_id: str,
    file: UploadFile = File(...)
):
    """Handle salary slip upload for underwriting"""
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Create uploads directory
        os.makedirs("uploads", exist_ok=True)
        
        # Save file
        file_path = f"uploads/{session_id}_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Simulate salary extraction (use OCR in production)
        salary = 50000.0
        
        session = sessions[session_id]
        session["customer_data"]["monthly_salary"] = salary
        
        # Re-evaluate
        loan_amount = session["loan_application"]["amount"]
        tenure = session["loan_application"]["tenure"]
        emi = calculate_emi(loan_amount, tenure)
        
        if emi <= (salary * 0.5):
            status = "approved"
            message = f"✅ Loan Approved! EMI (₹{emi:,}) is within your income limit."
        else:
            status = "rejected"
            message = f"❌ EMI (₹{emi:,}) exceeds 50% of your salary (₹{salary:,})."
        
        return {
            "success": True,
            "salary_detected": salary,
            "status": status,
            "message": message
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_sessions": len(sessions),
        "total_applications": len(applications)
    }

# ============================================================================
# RUN APPLICATION
# ============================================================================

if __name__ == "__main__":
    # Create necessary directories
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("sanction_letters", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    # Run server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )