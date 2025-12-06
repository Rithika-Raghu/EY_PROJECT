from typing import Dict, Tuple
import os
import re
from PyPDF2 import PdfReader
from google import genai
from google.genai import types


from agents.underwriting_agent import UnderwritingAgent
from agents.sanction_agent import SanctionAgent
from services.credit_bureau import CreditBureauAPI
from services.offer_mart import OfferMartService
from agents.verification_agent import VerificationAgent
from services.crm_service import CRMService

from agents.loan_chatbot_tools import (
    calc_emi,
    check_eligibility,
    underwrite,
    generate_sanction_letter,
)


class MasterAgent:
    """
    Master Agent (Main Orchestrator)
    - Manages conversation flow with the customer
    - Hands over tasks to Worker Agents
    - Coordinates workflow and starts/ends conversation
    """

    def __init__(self):
        self.agent_name = "Master Agent"
        self.current_stage = "welcome"
        self.active_worker = None
        self.pending_sanction = False

        # Initialize services
        self.crm = CRMService()
        self.credit_bureau = CreditBureauAPI()
        self.offer_mart = OfferMartService()

        # Initialize Worker Agents
        self.verification_agent = VerificationAgent(self.crm)
        self.underwriting_agent = UnderwritingAgent(self.credit_bureau, self.offer_mart)
        self.sanction_agent = SanctionAgent()

        self.api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBkcFjxM5flKoCK3Slxq5vkOJGyfYkhwwE")

        # Configure Gemini legacy SDK
        # genai.configure(api_key=self.api_key)

        # Model handle to use
        self.genai_client = genai.Client(api_key=self.api_key)

        # Sales Agent Chat (separate Gemini session for sales)
        self.sales_chat = None

    def _extract_name(self, message: str) -> str:
        """Extract customer name from initial greeting."""
        words = message.split()
        return message.title() if len(words) <= 3 else words[0].title()

    def handle_input(self, user_message: str, session: Dict) -> str:
        """
        Main orchestrator method - routes to appropriate worker agent based on stage.
        """

        # Initialize session structure
        session.setdefault("customer_data", {})
        session.setdefault("loan_application", {})

        # ========== STAGE 0: WELCOME ==========
        if self.current_stage == "welcome":
            return self._handle_welcome(user_message, session)

        # ========== STAGE 1: GET PHONE ==========
        elif self.current_stage == "get_phone":
            return self._handle_phone(user_message, session)

        # ========== STAGE 2: SALES AGENT (Worker 1 - Gemini-powered) ==========
        elif self.current_stage == "sales_chat":
            return self._handoff_to_sales_agent_gemini(user_message, session)

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

        # ========== FALLBACK ==========
        return "I'm here to assist you. Please continue with your application 😊"

    # ==================== MASTER AGENT METHODS ====================

    def _handle_welcome(self, user_message: str, session: Dict) -> str:
        """Stage 0: Capture customer name."""
        name = self._extract_name(user_message)
        session["customer_data"]["name"] = name
        self.current_stage = "get_phone"
        return f"Nice to meet you, {name}! 😊 Please enter your registered mobile number."

    def _handle_phone(self, user_message: str, session: Dict) -> str:
        """Stage 1: Capture phone and handoff to Sales Agent."""
        session["customer_data"]["phone"] = user_message
        self.current_stage = "sales_chat"
        self.active_worker = "SalesAgent (Gemini)"
        
        # Initialize Gemini Sales Chat
        self._init_sales_chat(session)
        
        return (
            "Perfect! 📞 Your number is verified.\n"
            "Let me connect you with our Sales Agent to understand your needs 💬\n"
            "What brings you here today — home renovation, business, wedding, or something else?"
        )

    def _init_sales_chat(self, session: Dict):
        """Initialize Gemini-powered Sales Agent chat."""
        customer_name = session["customer_data"].get("name", "Customer")

        SALES_SYSTEM_INSTRUCTION = f"""
    You are a friendly, persuasive sales agent for Tata Capital Personal Loans talking to {customer_name}.

    Your goals:
    1. Understand their loan purpose (home renovation, wedding, business, education, medical, travel, etc.)
    2. Discuss and negotiate loan amount
    3. Suggest optimal tenure (12-60 months)
    4. Explain benefits: competitive rates from 10.5% p.a., flexible tenure, instant approval
    5. Handle objections with empathy
    6. Close the deal and get customer agreement to proceed

    Guidelines:
    - Be warm, professional, and persuasive
    - Use emojis sparingly (💰 🏠 💼 ✅)
    - Ask ONE question at a time
    - When customer agrees to proceed, say exactly: "SALES_COMPLETE: Let's move forward with your application"
    - Use the calc_emi tool to show EMI calculations when discussing amounts
    - Use check_eligibility to validate affordability

    Do NOT:
    - Collect formal application details (purpose/amount/tenure as form fields) - just discuss naturally
    - Perform underwriting or approval
    - Ask for documents
    """

        self.sales_chat = self.genai_client.chats.create(
            model="gemini-2.5-flash",
            config={
                "system_instruction": SALES_SYSTEM_INSTRUCTION,
            }
        )
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
                    "\n\n✅ Great news! Now handing over to our Verification Agent "
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

    def _handoff_to_sales_agent_gemini(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 1: Sales Agent (Gemini-powered)
        Handles natural conversation, negotiation, and persuasion using Gemini.
        """

        # Initialize sales chat if not already done
        if not self.sales_chat:
            self._init_sales_chat(session)

        # Send message to Gemini Sales Agent
        reply = self.sales_chat.send_message(
            user_message,
            tools=[calc_emi, check_eligibility]  # pass tools per-message
        )

    # Robust text extraction
    def _extract_text(reply_obj) -> str:
        # 1️⃣ direct text
        if hasattr(reply_obj, "output_text") and reply_obj.output_text:
            return reply_obj.output_text.strip()

        # 2️⃣ candidate text
        try:
            if hasattr(reply_obj, "candidates"):
                for candidate in reply_obj.candidates:
                    for part in candidate.content.parts:
                        if hasattr(part, "text") and part.text:
                            return part.text.strip()
        except Exception:
            pass

        # 3️⃣ tool outputs
        if hasattr(reply_obj, "tool_outputs") and reply_obj.tool_outputs:
            return str(reply_obj.tool_outputs).strip()

        # 4️⃣ fallback
        return ""

    reply_text = _extract_text(reply)

    # Fallback if no response
    if not reply_text:
        return "Sorry, I didn’t quite catch that, could you repeat?"

    # Check if sales conversation is complete
    if "SALES_COMPLETE" in reply_text:
        session["sales_completed"] = True
        self.current_stage = "get_purpose"
        self.active_worker = None
        self.sales_chat = None  # Clean up

        # Remove the SALES_COMPLETE marker from response
        reply_text = reply_text.replace("SALES_COMPLETE:", "").strip()
        reply_text += (
            "\n\nAwesome 😎 Let's move forward with your application.\n"
            "What is the purpose of your loan? (Education / Wedding / Home Renovation etc)"
        )

    return reply_text


    def _handoff_to_underwriting_salary(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 2: Underwriting Agent (Salary Document Processing)
        - Fetches dummy credit score from mock credit bureau API
        - Validates eligibility based on salary slip
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
        Confirms KYC details (phone, address) from dummy CRM server.
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
            return (
                f"{response}\n\n✅ All KYC documents verified successfully!\n"
                "You are now eligible for your sanction letter.\n\n"
                "Type 'Yes' to generate it."
            )

        except Exception as e:
            return f"⚠️ Error verifying Aadhaar: {e}"

    def _handoff_to_sanction_agent(self, user_message: str, session: Dict) -> str:
        """
        Worker Agent 4: Sanction Letter Generator
        Generates automated PDF sanction letter if all conditions are met.
        """
        if user_message.strip().lower() in ["yes", "y", "generate", "proceed"]:
            file = self.sanction_agent.generate_sanction_letter(
                session["customer_data"], session["loan_application"]
            )
            self.pending_sanction = False
            self.active_worker = None
            return f"✅ Sanction letter generated successfully!\n📄 Saved as: {file}"

        return "Please type 'Yes' to generate your sanction letter."


# ==================== MAIN EXECUTION ====================

if __name__ == "__main__":
    agent = MasterAgent()
    session = {"customer_data": {}, "loan_application": {}}

    print("🤖 SmartLoan AI Assistant Activated!\n")
    print(f"Active Agent: {agent.agent_name}\n")

    while True:
        user = input("You: ")
        reply = agent.handle_input(user, session)
        
        if agent.active_worker:
            print(f"\n[🔄 Handed off to: {agent.active_worker}]")
        
        print(f"Agent: {reply}\n")
