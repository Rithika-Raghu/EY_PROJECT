from typing import Dict
import os
import re

from agents.underwriting_agent import UnderwritingAgent
from agents.sanction_agent import SanctionAgent
from services.credit_bureau import CreditBureauAPI
from services.offer_mart import OfferMartService
from agents.verification_agent import VerificationAgent
from services.crm_service import CRMService
from agents.sales_agent import SalesAgent
from PyPDF2 import PdfReader
from llm_loader import get_llm


class MasterAgent:
    """
    Master Agent orchestrates customer interaction.
    Flow:
      welcome -> get_phone -> get_purpose -> sales_chat (SalesAgent handles dialogue)
      Once SalesAgent completes, MasterAgent runs underwriting and moves to verification/salary steps.
    """

    def __init__(self):
        self.agent_name = "Master Agent"
        self.current_stage = "welcome"
        self.pending_sanction = False
        self.llm = get_llm()
        self.crm = CRMService()
        self.credit_bureau = CreditBureauAPI()
        self.offer_mart = OfferMartService()
        self.underwriter = UnderwritingAgent(self.credit_bureau, self.offer_mart)
        self.sanction_agent = SanctionAgent()
        self.verification = VerificationAgent(self.crm)
        self.sales_agent = SalesAgent()
        self._temp = {}

    def reset(self):
        self.current_stage = "welcome"
        self.pending_sanction = False
        self._temp = {}
        for ag in (self.sales_agent, self.verification, self.underwriter, self.sanction_agent):
            if hasattr(ag, "reset"):
                try:
                    ag.reset()
                except Exception:
                    pass

    def _extract_name(self, message: str) -> str:
        words = (message or "").split()
        if len(words) <= 3:
            return (message or "").title()
        return words[0].title()

    def handle_input(self, user_message: str, session: Dict) -> str:
        user_message = (user_message or "").strip()

        # quick sanction generation if pending and user says yes
        if (self.pending_sanction and user_message.lower() in ["yes", "y"] and self.current_stage == "done"):
            file = self.sanction_agent.generate_sanction_letter(
                session.get("customer_data", {}), session.get("loan_application", {})
            )
            self.pending_sanction = False
            return f"✅ Sanction letter generated successfully!\n📄 Saved as: {file}"

        # defensive session initialization
        session.setdefault("customer_data", {})
        session.setdefault("loan_application", {})

        # Welcome -> ask name
        if self.current_stage == "welcome":
            name = self._extract_name(user_message) or "Customer"
            session["customer_data"]["name"] = name
            self.current_stage = "get_phone"
            return f"Nice to meet you, {name}! 😊 Please enter your registered mobile number."

        # get_phone -> ask purpose
        if self.current_stage == "get_phone":
            session["customer_data"]["phone"] = user_message
            self.current_stage = "get_purpose"
            return (
                "Perfect! 📞 Your number is verified.\n"
                "Let’s chat with our Sales Agent to understand your needs better 💬\n"
                "What brings you here today — home renovation, business, wedding, or something else?"
            )

        # get_purpose -> hand over to SalesAgent (start sales flow)
        if self.current_stage == "get_purpose":
            # store the purpose in customer_data but let SalesAgent run full flow (it will ask for purpose again if needed)
            session["customer_data"]["purpose"] = user_message
            # reset sales agent state and tell it to begin (it will ask purpose)
            self.sales_agent.reset()
            session["sales_state"] = self.sales_agent.conversation_state
            self.current_stage = "sales_chat"
            # Let the sales agent take the next message (we may pass the user's purpose message right away)
            # We pass the current message so that SalesAgent can accept a purpose if user already provided it
            sales_reply = self.sales_agent.talk(user_message, session)
            # If sales agent completed in this same turn, perform underwriting now (below)
            if session.get("sales_state") == "complete" or self.sales_agent.conversation_state == "complete":
                return self._post_sales_underwrite_and_respond(session, sales_reply)
            return sales_reply

        # sales_chat: delegate to SalesAgent until it marks complete; also handle EMI/rate queries
        if self.current_stage == "sales_chat":
            # handle rate/emi queries via sales agent helper
            if self.sales_agent.detect_rate_query(user_message):
                return self.sales_agent.handle_objection(user_message)

            sales_reply = self.sales_agent.talk(user_message, session)

            # after sales agent reply, check if sales completed -> run underwriting
            if session.get("sales_state") == "complete" or self.sales_agent.conversation_state == "complete":
                return self._post_sales_underwrite_and_respond(session, sales_reply)

            return sales_reply

        # await_tenure (legacy) - keep compatibility (should rarely be used)
        if self.current_stage == "await_tenure":
            tenure = self.sales_agent.extract_tenure_months(user_message)
            if not tenure:
                return "Please specify the tenure in months (12, 24, 36, 48, or 60)."
            session["loan_application"]["tenure"] = int(tenure)
            result = self.underwriter.evaluate_application(session["customer_data"], session["loan_application"])
            if "rate" in result:
                session["loan_application"]["rate"] = result["rate"]
            msg = result["message"]
            if result["status"] == "approved":
                session["loan_application"]["emi"] = result["emi"]
                self.current_stage = "await_verification"
                msg += "\n\n✅ Before generating your sanction letter, we need to verify your documents (PAN/Aadhaar). Please upload your PAN card PDF now."
            elif result["status"] == "requires_documents":
                self.current_stage = "await_salary"
                msg += "\nPlease upload your salary slip PDF now."
            else:
                self.current_stage = "sales_chat"
            return msg

        # await_salary: process salary pdf, unchanged
        if self.current_stage == "await_salary":
            try:
                filepath = user_message
                if not os.path.exists(filepath):
                    return f"⚠️ File not found: {filepath}"
                reader = PdfReader(filepath)
                text = "".join([page.extract_text() or "" for page in reader.pages])
                cleaned_text = re.sub(r"[^\w\s₹,.\-]", "", text)
                cleaned_text = re.sub(r"\s+", " ", cleaned_text)
                salary_lines = re.findall(r"(?:Net|Gross|Basic)\s*Salary[:\s₹]*([\d,]+)", cleaned_text, flags=re.IGNORECASE)
                if not salary_lines:
                    salary_lines = re.findall(r"(?:Net|Gross|Basic)[:\s₹]*([\d,]+)", cleaned_text, flags=re.IGNORECASE)
                if salary_lines:
                    monthly_salary = float(salary_lines[-1].replace(",", ""))
                else:
                    fallback = re.findall(r"₹\s?([\d,]+)", cleaned_text)
                    if fallback:
                        monthly_salary = float(fallback[-1].replace(",", ""))
                    else:
                        return f"⚠️ Could not detect salary in the document. Text extracted: {cleaned_text[:150]}..."
                result = self.underwriter.evaluate_with_salary(session["customer_data"], session["loan_application"], monthly_salary)
                if "rate" in result:
                    session["loan_application"]["rate"] = result["rate"]
                msg = result["message"]
                if result["status"] == "approved":
                    session["loan_application"]["emi"] = result["emi"]
                    self.current_stage = "await_verification"
                    msg += "\n\n✅ Before sanctioning, we’ll need to verify your documents (PAN/Aadhaar). Please upload your PAN card PDF now."
                elif result["status"] == "rejected":
                    self.current_stage = "done"
                return msg
            except Exception as e:
                return f"⚠️ Error reading salary slip: {e}"

        # await_verification (PAN)
        if self.current_stage == "await_verification":
            try:
                document_type = "pan"
                response, ok = self.verification.verify_documents(document_type, user_message, session)
                if not ok:
                    return response
                self.current_stage = "await_aadhaar"
                return f"{response}\n\nNow please upload your Aadhaar card PDF for verification."
            except Exception as e:
                return f"⚠️ Error verifying PAN document: {e}"

        # await_aadhaar
        if self.current_stage == "await_aadhaar":
            try:
                document_type = "aadhaar"
                response, ok = self.verification.verify_documents(document_type, user_message, session)
                if not ok:
                    return response
                self.pending_sanction = True
                self.current_stage = "done"
                return f"{response}\n\n✅ All KYC documents verified successfully!\nYou are now eligible for your sanction letter.\n\nType 'Yes' to generate it."
            except Exception as e:
                return f"⚠️ Error verifying Aadhaar document: {e}"

        return "I'm here to assist you — continue 😊"

    # ---------------------------
    # Helpers
    # ---------------------------
    def _post_sales_underwrite_and_respond(self, session: dict, sales_reply: str) -> str:
        """
        Called once SalesAgent completes. Run underwriting and return combined message
        (sales agent message + underwriting result + next steps).
        """
        # ensure we have amount and tenure in session
        loan_app = session.setdefault("loan_application", {})
        amount = loan_app.get("amount")
        tenure = loan_app.get("tenure")
        # if tenure is missing but sales agent stored in session keys, pick it
        if not tenure and session.get("loan_tenure"):
            loan_app["tenure"] = session["loan_tenure"]
            tenure = loan_app["tenure"]
        # if amount missing but sales agent stored, pick it
        if not amount and session.get("loan_amount"):
            loan_app["amount"] = session["loan_amount"]
            amount = loan_app["amount"]

        # If still missing critical data, ask user (hand back)
        if not amount:
            self.current_stage = "sales_chat"
            return sales_reply + "\n\n⚠️ I couldn't detect the loan amount. Could you provide it again (e.g., 200000)?"
        if not tenure:
            self.current_stage = "sales_chat"
            return sales_reply + "\n\n⚠️ I couldn't detect the tenure. Could you provide it again (in months, e.g., 24)?"

        # run underwriting
        result = self.underwriter.evaluate_application(session["customer_data"], loan_app)
        if "rate" in result:
            session["loan_application"]["rate"] = result["rate"]
        msg = sales_reply + "\n\n" + result["message"]

        if result["status"] == "approved":
            session["loan_application"]["emi"] = result["emi"]
            self.current_stage = "await_verification"
            msg += "\n\n✅ Before generating your sanction letter, we need to verify your documents (PAN/Aadhaar). Please upload your PAN card PDF now."
        elif result["status"] == "requires_documents":
            self.current_stage = "await_salary"
            msg += "\nPlease upload your salary slip PDF now."
        else:
            # if rejected or other status, stay in sales_chat to allow user to change details
            self.current_stage = "sales_chat"

        return msg
