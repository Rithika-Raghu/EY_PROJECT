from typing import Dict, Tuple
from groq import Groq
import os
import re
from PyPDF2 import PdfReader

# Import database service
from services.database import DatabaseService

# Import updated services
from services.crm_service import CRMService
from services.credit_bureau import CreditBureauAPI
from services.offer_mart import OfferMartService

# Import agents
from agents.underwriting_agent import UnderwritingAgent
from agents.sanction_agent import SanctionAgent
from agents.verification_agent import VerificationAgent


class MasterAgent:
    """
    Master Agent (Main Orchestrator)
    - Manages conversation flow with the customer
    - Hands over tasks to Worker Agents
    - Coordinates workflow and starts/ends conversation
    """

    def __init__(self):
        self.agent_name = "Master Agent"
        
        # ✅ Initialize persistent database FIRST
        print("🔄 Initializing database...")
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        DB_PATH = os.path.join(BASE_DIR, '..', 'loan_system.db')
        
        print(f"🔄 Initializing database at: {DB_PATH}")
        self.db = DatabaseService(DB_PATH)
        #self.db = DatabaseService("loan_system.db")
        
        # Initialize services (shared across sessions) with database
        self.crm = CRMService(self.db)
        self.credit_bureau = CreditBureauAPI(self.db)
        self.offer_mart = OfferMartService(self.db)

        # Initialize Worker Agents (shared)
        self.verification_agent = VerificationAgent(self.db)
        self.underwriting_agent = UnderwritingAgent(self.credit_bureau, self.offer_mart)
        self.sanction_agent = SanctionAgent()

        # Groq API
        self.groq_api_key = os.getenv("GROQ_API_KEY", "INPUT KEY")
        self.groq_client = Groq(api_key=self.groq_api_key)
        
        # ✅ Session-specific state (will be reset per conversation)
        self.reset_conversation()

    def reset_conversation(self):
        """✅ Reset conversation state for new customer"""
        self.current_stage = "welcome"
        self.active_worker = None
        self.pending_sanction = False
        self.sales_chat_history = []
        self.sales_system_prompt = None
        print("✅ Conversation reset. Ready for new customer!\n")

    def _extract_name(self, message: str) -> str:
        """Extract customer name from initial greeting."""
        words = message.split()
        return message.title() if len(words) <= 3 else words[0].title()

    def _extract_loan_details_from_conversation(self, session: Dict):
        """
        Extract loan details from sales conversation history
        """
        # Combine all conversation text
        conversation_text = " ".join([
            msg["content"] for msg in self.sales_chat_history
        ]).lower()
        
        print(f"\n🔍 Extracting details from conversation...")
        print(f"📝 Conversation text: {conversation_text[:200]}...")
        
        # Extract loan amount
        amount_patterns = [
            r'(\d+)\s*(?:lakh|lakhs|lac|lacs)',
            r'₹\s*(\d+(?:,\d+)*)',
            r'(?:amount|loan|need|want|borrow).*?(\d+)',
        ]
        
        for pattern in amount_patterns:
            matches = re.findall(pattern, conversation_text)
            if matches:
                amount_str = matches[-1].replace(',', '')
                amount = float(amount_str)
                
                # Convert lakhs to rupees if needed
                if 'lakh' in conversation_text or 'lac' in conversation_text:
                    if amount < 100:  # Likely in lakhs
                        amount *= 100000
                elif amount < 1000:  # Small number, probably lakhs
                    amount *= 100000
                
                session["loan_application"]["amount"] = int(amount)
                print(f"💰 Extracted amount: ₹{int(amount):,}")
                break
        
        # Extract tenure
        tenure_patterns = [
            r'(\d+)\s*(?:month|months|mnth|mon)',
            r'(\d+)\s*(?:year|years|yr|yrs)',
        ]
        
        for pattern in tenure_patterns:
            matches = re.findall(pattern, conversation_text)
            if matches:
                tenure = int(matches[-1])
                
                # Convert years to months if needed
                if 'year' in conversation_text or 'yr' in conversation_text:
                    tenure *= 12
                
                session["loan_application"]["tenure"] = tenure
                print(f"📅 Extracted tenure: {tenure} months")
                break
        
        # Extract purpose
        purposes = ["business", "education", "medical", "wedding", "travel", "home", 
                   "personal", "renovation", "marriage", "study", "car", "vehicle"]
        for purpose in purposes:
            if purpose in conversation_text:
                session["customer_data"]["purpose"] = purpose
                print(f"📌 Extracted purpose: {purpose}")
                break
        
        # Set defaults if not found
        if "amount" not in session["loan_application"]:
            session["loan_application"]["amount"] = 300000  # Default 3 lakhs
            print("⚠️ Amount not found, using default: ₹3,00,000")
        
        if "tenure" not in session["loan_application"]:
            session["loan_application"]["tenure"] = 36  # Default 36 months
            print("⚠️ Tenure not found, using default: 36 months")
        
        if "purpose" not in session["customer_data"]:
            session["customer_data"]["purpose"] = "personal"
            print("⚠️ Purpose not found, using default: personal")

    def handle_input(self, user_message: str, session: Dict) -> str:
        """
        Main orchestrator method - routes to appropriate worker agent based on stage.
        """
        
        # ✅ Check for reset command
        if user_message.strip().lower() in ["reset", "restart", "new", "clear"]:
            self.reset_conversation()
            session.clear()
            session["customer_data"] = {}
            session["loan_application"] = {}
            return "🔄 Conversation reset! Let's start fresh.\n\nHi! Welcome to Aurum 🏦\nWhat's your name?"

        # Initialize session structure
        session.setdefault("customer_data", {})
        session.setdefault("loan_application", {})

        # ========== STAGE 0: WELCOME ==========
        if self.current_stage == "welcome":
            return self._handle_welcome(user_message, session)

        # ========== STAGE 1: GET PHONE ==========
        elif self.current_stage == "get_phone":
            return self._handle_phone(user_message, session)

        # ========== STAGE 2: SALES AGENT (Worker 1 - Groq-powered) ==========
        elif self.current_stage == "sales_chat":
            return self._handoff_to_sales_agent_groq(user_message, session)

        # ========== STAGE 3: COLLECT APPLICATION DETAILS ==========
        elif self.current_stage == "get_purpose":
            return self._handle_purpose(user_message, session)

        elif self.current_stage == "get_amount":
            return self._handle_amount(user_message, session)

        elif self.current_stage == "get_tenure":
            return self._handle_tenure_and_handoff_underwriting(user_message, session)

        # ========== STAGE 4: UNDERWRITING AGENT (Worker 2) - Salary Verification ==========
        elif self.current_stage == "await_salary":
            return self._handoff_to_underwriting_salary(user_message, session)

        # ========== STAGE 5: VERIFICATION AGENT (Worker 3) - KYC ==========
        elif self.current_stage == "await_verification":
            return self._handoff_to_verification_pan(user_message, session)

        elif self.current_stage == "await_aadhaar":
            return self._handoff_to_verification_aadhaar(user_message, session)

        # ========== STAGE 6: SANCTION LETTER AGENT (Worker 4) ==========
        elif self.current_stage == "done" and self.pending_sanction:
            return self._handoff_to_sanction_agent(user_message, session)
        
        # ========== CONVERSATION COMPLETE ==========
        elif self.current_stage == "done":
            return (
                "✅ Your loan application is complete!\n\n"
                "Type 'reset' to start a new application."
            )

        # ========== FALLBACK ==========
        return "I'm here to assist you. Please continue with your application 😊\n(Type 'reset' to start over)"

    # ==================== MASTER AGENT METHODS ====================

    def _handle_welcome(self, user_message: str, session: Dict) -> str:
        """Stage 0: Capture customer name."""
        name = self._extract_name(user_message)
        session["customer_data"]["name"] = name
        self.current_stage = "get_phone"
        return f"Nice to meet you, {name}! 😊 Please enter your registered mobile number."

    def _handle_phone(self, user_message: str, session: Dict) -> str:
        """Stage 1: Capture phone and fetch customer data from database"""
        # Basic phone validation
        phone = re.sub(r'[^\d]', '', user_message)
        if len(phone) < 10:
            return "⚠️ Please enter a valid 10-digit mobile number."
        
        session["customer_data"]["phone"] = phone
        
        # ✅ Fetch customer data from database
        customer = self.db.get_customer_by_phone(phone)
        
        if customer:
            # Existing customer - pre-fill data
            session["customer_data"].update({
                "user_id": customer.get("id"),
                "name": customer.get("username", "Customer"),  # ✅ username, not name
                "city": customer.get("city", ""),
                "email": customer.get("email", ""),
                "credit_score": customer.get("credit_score", 750),
                "pre_approved_limit": customer.get("pre_approved_limit", 0),
                "existing_customer": True
            })
            
            self.current_stage = "sales_chat"
            self.active_worker = "SalesAgent (Groq)"
            
            # Initialize Groq Sales Chat
            self._init_sales_chat_groq(session)
            # ✅ Use .get() to safely access values
            username = customer.get("username", "Customer")
            city = customer.get("city", "N/A")
            limit = customer.get("pre_approved_limit", 0)
            score = customer.get("credit_score", 750)
            
            return (
                f"Welcome back, {username}! 🎉\n"
                f" City: {city}\n"
                f"Pre-approved limit: ₹{limit:,}\n"
                f" Credit Score: {score}/900\n\n"
                f"Let me connect you with our Sales Agent to discuss your loan needs \n\n"
                "What brings you here today — home renovation, business, wedding, or something else?"
            )
        else:
            # New customer
            self.current_stage = "sales_chat"
            self.active_worker = "SalesAgent (Groq)"
            
            # Initialize Groq Sales Chat
            self._init_sales_chat_groq(session)
            
            return (
                "Perfect! Your number is verified.\n"
                "Let me connect you with our Sales Agent to understand your needs \n\n"
                "What brings you here today — home renovation, business, wedding, or something else?"
            )

    def _init_sales_chat_groq(self, session: Dict):
        """Initialize Groq-powered Sales Agent chat."""
        customer_name = session["customer_data"].get("name", "Customer")
        pre_approved = session["customer_data"].get("pre_approved_limit", 0)
        
        pre_approved_text = f"They have a pre-approved limit of ₹{pre_approved:,}." if pre_approved > 0 else ""
        
        self.sales_system_prompt = f"""You are a friendly, persuasive sales agent for Tata Capital Personal Loans talking to {customer_name}. {pre_approved_text}

Your goals:
1. Understand their loan purpose (home renovation, wedding, business, education, medical, travel, etc.)
2. Discuss and negotiate loan amount (suggest realistic amounts based on purpose)
3. Suggest optimal tenure (12-60 months)
4. Explain benefits: competitive rates from 10.5% p.a., flexible tenure, instant approval
5. Handle objections with empathy and alternative solutions
6. Close the deal and get customer agreement to proceed

IMPORTANT: You MUST clearly discuss and get specific answers for these THREE things:
- Loan purpose (exactly what they need it for)
- Loan amount (specific number in rupees or lakhs)
- Loan tenure (specific number in months or years)

Guidelines:
- Be warm, professional, and persuasive
- Use emojis sparingly (💰 🏠 💼 ✅)
- Ask ONE question at a time
- When discussing amounts, provide EMI estimates
- ONLY say "SALES_COMPLETE: Let's move forward with your application" when you have EXPLICIT answers for purpose, amount, AND tenure
- Keep responses concise (2-4 sentences maximum)

Example conversation flow:
User: "I need a loan for business"
You: "Great! Business loans are very popular. How much funding do you need for your business?"
User: "5 lakhs"
You: "Perfect! ₹5 lakhs is a good amount. What repayment tenure would suit you - 24 months, 36 months, or 48 months?"
User: "36 months"
You: "Excellent choice! With ₹5 lakhs for 36 months, your EMI would be around ₹16,500. Shall we proceed with your application?"
User: "Yes"
You: "SALES_COMPLETE: Let's move forward with your application"

Sales Techniques:
- Mirror customer's language
- Use social proof ("Most customers prefer...")
- Create urgency subtly ("Special rates this month...")
- Always mention EMI when discussing amount

Do NOT say SALES_COMPLETE until you have EXPLICIT, SPECIFIC answers for:
✓ Purpose (business/education/wedding/etc)
✓ Amount (specific number like 5 lakhs, ₹500000, etc)
✓ Tenure (specific number like 36 months, 3 years, etc)"""

        # Reset conversation history
        self.sales_chat_history = []
        print(f"🤖 Sales Agent initialized for {customer_name}")

    def _handle_purpose(self, user_message: str, session: Dict) -> str:
        """Stage 3: Capture loan purpose."""
        session["customer_data"]["purpose"] = user_message
        self.current_stage = "get_amount"
        return "Understood ✅ Please enter the loan amount (in ₹):"

    def _handle_amount(self, user_message: str, session: Dict) -> str:
        """Stage 4: Capture loan amount."""
        try:
            amount = int(user_message.replace(",", ""))
            session["loan_application"]["amount"] = amount
            self.current_stage = "get_tenure"
            return "Great! Enter the loan tenure in months (12 / 24 / 36 / 48 etc):"
        except ValueError:
            return "⚠️ Please enter loan amount in numbers only."

    def _handle_tenure_and_handoff_underwriting(
        self, user_message: str, session: Dict
    ) -> str:
        """Stage 5: Capture tenure and handoff to Underwriting Agent."""
        try:
            tenure = int(user_message)
            session["loan_application"]["tenure"] = tenure
            self.active_worker = "UnderwritingAgent"

            # Handoff to Underwriting Agent
            result = self.underwriting_agent.evaluate_application(
                session["customer_data"], session["loan_application"]
            )

            if "rate" in result:
                session["loan_application"]["rate"] = result["rate"]

            msg = result.get("message", "")

            if result["status"] == "approved":
                session["loan_application"]["emi"] = result["emi"]
                self.current_stage = "await_verification"
                self.active_worker = "VerificationAgent"
                msg += (
                    "\n\nGreat news! Now handing over to our Verification Agent "
                    "to verify your documents (PAN/Aadhaar).\n"
                    "Please upload your PAN card PDF now."
                )

            elif result["status"] == "requires_documents":
                self.current_stage = "await_salary"
                msg += "\n📄 Please upload your salary slip PDF for further evaluation."

            elif result["status"] == "rejected":
                self.current_stage = "done"
                self.active_worker = None

            return msg

        except ValueError:
            return "⚠️ Please enter tenure in numbers only."

    # ==================== WORKER AGENT HANDOFFS ====================

    def _handoff_to_sales_agent_groq(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 1: Sales Agent (Groq-powered)
        Natural conversation, negotiation, and persuasion using Groq Llama 3.3.
        """
        if not self.sales_system_prompt:
            self._init_sales_chat_groq(session)

        # Add user message to history
        self.sales_chat_history.append({
            "role": "user",
            "content": user_message
        })

        # Build messages for Groq
        messages = [
            {"role": "system", "content": self.sales_system_prompt},
            *self.sales_chat_history
        ]

        # Call Groq API
        try:
            response = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=500,
                top_p=0.9
            )
            
            reply_text = response.choices[0].message.content

            # Add assistant response to history
            self.sales_chat_history.append({
                "role": "assistant",
                "content": reply_text
            })

        except Exception as e:
            return f"⚠️ Error communicating with sales agent: {e}"

        # Check if sales conversation is complete
        if "SALES_COMPLETE" in reply_text:
            session["sales_completed"] = True
            
            # ✅ EXTRACT LOAN DETAILS FROM CONVERSATION
            self._extract_loan_details_from_conversation(session)
            
            # ✅ SKIP manual data collection and go directly to underwriting
            self.current_stage = "get_tenure"  # Will trigger underwriting
            self.active_worker = "UnderwritingAgent"
            
            # Remove the SALES_COMPLETE marker from response
            reply_text = reply_text.replace("SALES_COMPLETE:", "").strip()
            
            # Show extracted details
            amount = session["loan_application"].get("amount", 0)
            tenure = session["loan_application"].get("tenure", 36)
            purpose = session["customer_data"].get("purpose", "personal")
            
            reply_text += f"\n\n Perfect! I've captured your details:"
            reply_text += f"\n Purpose: {purpose.title()}"
            reply_text += f"\n Amount: ₹{amount:,}"
            reply_text += f"\n Tenure: {tenure} months"
            reply_text += f"\n\n🔄 Now processing your application with our Underwriting Agent..."
            
            # ✅ DIRECTLY CALL UNDERWRITING
            result = self.underwriting_agent.evaluate_application(
                session["customer_data"], session["loan_application"]
            )
            
            if "rate" in result:
                session["loan_application"]["rate"] = result["rate"]
            
            underwriting_msg = result.get("message", "")
            
            if result["status"] == "approved":
                session["loan_application"]["emi"] = result["emi"]
                self.current_stage = "await_verification"
                self.active_worker = "VerificationAgent"
                underwriting_msg += (
                    "\n\nGreat news! Now handing over to our Verification Agent "
                    "to verify your documents (PAN/Aadhaar).\n"
                    "Please upload your PAN card PDF now."
                )
            
            elif result["status"] == "requires_documents":
                self.current_stage = "await_salary"
                underwriting_msg += "\n📄 Please upload your salary slip PDF for further evaluation."
            
            elif result["status"] == "rejected":
                self.current_stage = "done"
                self.active_worker = None
            
            # ✅ Clear sales chat history after completion
            self.sales_chat_history = []
            
            return reply_text + "\n\n" + underwriting_msg

        return reply_text

    def _handoff_to_underwriting_salary(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 2: Underwriting Agent (Salary Document Processing)
        """
        try:
            filepath = user_message.strip()

            if not os.path.exists(filepath):
                return f"⚠️ File not found: {filepath}"

            # Extract salary from PDF
            reader = PdfReader(filepath)
            text = "".join([page.extract_text() or "" for page in reader.pages])

            cleaned_text = re.sub(r"[^\w\s₹,.\-]", " ", text)
            cleaned_text = re.sub(r"\s+", " ", cleaned_text)

            salary_lines = re.findall(
                r"(?:Net|Gross|Basic)\s*Salary[:\s₹]*([\d,]+)",
                cleaned_text,
                flags=re.IGNORECASE,
            )

            if not salary_lines:
                salary_lines = re.findall(
                    r"(?:Net|Gross|Basic)[:\s₹]*([\d,]+)",
                    cleaned_text,
                    flags=re.IGNORECASE,
                )

            if salary_lines:
                monthly_salary = float(salary_lines[-1].replace(",", ""))
            else:
                fallback = re.findall(r"₹\s?([\d,]+)", cleaned_text)
                if fallback:
                    monthly_salary = float(fallback[-1].replace(",", ""))
                else:
                    return (
                        "⚠️ Could not detect salary. "
                        f"Extracted text: {cleaned_text[:150]}..."
                    )

            # Handoff to Underwriting Agent for re-evaluation
            result = self.underwriting_agent.evaluate_with_salary(
                session["customer_data"], session["loan_application"], monthly_salary
            )

            if "rate" in result:
                session["loan_application"]["rate"] = result["rate"]

            msg = result.get("message", "")

            if result["status"] == "approved":
                session["loan_application"]["emi"] = result["emi"]
                self.current_stage = "await_verification"
                self.active_worker = "VerificationAgent"
                msg += (
                    "\n\n✅ Loan approved! Now transferring to Verification Agent.\n"
                    "Please upload your PAN card PDF for KYC verification."
                )

            elif result["status"] == "rejected":
                self.current_stage = "done"
                self.active_worker = None

            return msg

        except Exception as e:
            return f"⚠️ Error reading salary slip: {e}"

    def _handoff_to_verification_pan(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 3: Verification Agent - PAN Document Verification
        """
        try:
            document_type = "pan"
            response, ok = self.verification_agent.verify_documents(
                document_type, user_message, session
            )

            if not ok:
                return response

            self.current_stage = "await_aadhaar"
            return f"{response}\n\nNow please upload your Aadhaar card PDF for verification."

        except Exception as e:
            return f"⚠️ Error verifying PAN: {e}"

    def _handoff_to_verification_aadhaar(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 3: Verification Agent - Aadhaar Document Verification
        """
        try:
            document_type = "aadhaar"
            response, ok = self.verification_agent.verify_documents(
                document_type, user_message, session
            )

            if not ok:
                return response

            self.pending_sanction = True
            self.current_stage = "done"
            self.active_worker = "SanctionAgent"
            
            # ✅ FIX: Save loan application with user_id
            phone = session["customer_data"]["phone"]
            customer = self.db.get_customer_by_phone(phone)
            
            if customer:
                user_id = customer.get("id")
                if user_id:
                    self.db.save_loan_application(user_id, session["loan_application"])
                    print(f"✅ Loan saved for user_id: {user_id}")
                else:
                    print("⚠️ No user_id found in customer record")
            else:
                print(f"⚠️ Customer not found for phone: {phone}")
            
            return (
                f"{response}\n\n✅ All KYC documents verified successfully!\n"
                "You are now eligible for your sanction letter.\n\n"
                "Type 'Yes' to generate it."
            )

        except Exception as e:
            print(f"❌ Error in aadhaar verification: {str(e)}")
            return f"⚠️ Error verifying Aadhaar: {e}"


    def _handoff_to_sanction_agent(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 4: Sanction Letter Generator
        """
        if user_message.strip().lower() in ["yes", "y", "generate", "proceed"]:
            file = self.sanction_agent.generate_sanction_letter(
                session["customer_data"], session["loan_application"]
            )
            self.pending_sanction = False
            self.active_worker = None
            self.current_stage = "done"  # Mark as complete
            return (
                f"✅ Sanction letter generated successfully!\n"
                f"Saved as: {file}\n\n"
                f"Thank you for choosing Aurum!\n"
                f"Type 'reset' to start a new application."
            )

        return "Please type 'Yes' to generate your sanction letter."


# ==================== MAIN EXECUTION ====================

if __name__ == "__main__":
    agent = MasterAgent()
    session = {"customer_data": {}, "loan_application": {}}

    print("\n" + "="*60)
    print("SmartLoan AI Assistant Activated!")
    print("Powered by Groq Llama 3.3 70B")
    print("30 RPM | 14,400 RPD")
    print("="*60)
    print(f"Active Agent: {agent.agent_name}\n")
    print("Commands:")
    print("   - Type 'reset' to start new conversation")
    print("   - Type 'quit' to exit")
    print("   - Type 'list' to see dummy customer phones")
    print("="*60 + "\n")

    # Welcome message
    print("Agent: Hi! Welcome to Aurum")
    print("What's your name?\n")

    while True:
        user = input("You: ").strip()
        
        # Handle special commands
        if user.lower() in ["quit", "exit", "bye"]:
            print("\n Thank you for using Au! Goodbye!\n")
            break
        
        if user.lower() == "list":
            print("\n📋 Dummy Customer Phone Numbers:")
            print("   9876543210 - Rajesh Kumar (Credit: 780)")
            print("   9876543211 - Priya Sharma (Credit: 820)")
            print("   9876543214 - Vikram Singh (Credit: 850, High limit)")
            print("   9876543213 - Sneha Reddy (Credit: 690)")
            print("   9876543217 - Deepa Nair (Credit: 790)")
            print()
            continue
        
        if not user:
            continue
        
        reply = agent.handle_input(user, session)
        
        if agent.active_worker:
            print(f"\n[🔄 Handed off to: {agent.active_worker}]")
        
        print(f"\nAgent: {reply}\n")
