from typing import Dict
from langchain_community.llms import HuggingFaceHub
import os , re
from agents.underwriting_agent import UnderwritingAgent
from agents.sanction_agent import SanctionAgent
from services.credit_bureau import CreditBureauAPI
from services.offer_mart import OfferMartService
from agents.verification_agent import VerificationAgent
from services.crm_service import CRMService
from agents.sales_agent import SalesAgent
from PyPDF2 import PdfReader

class MasterAgent:
    """
    Master Agent orchestrates customer interaction
    + passes loan application to underwriting agent
    + triggers sanction letter agent only after user says YES
    """

    def __init__(self):
        self.agent_name = "Master Agent"
        self.current_stage = "welcome"
        self.pending_sanction = False
        self.sales_stage = 0

        # Initialize services & worker agents
        self.crm = CRMService()
        self.credit_bureau = CreditBureauAPI()
        self.offer_mart = OfferMartService()
        self.underwriter = UnderwritingAgent(self.credit_bureau, self.offer_mart)
        self.sanction_agent = SanctionAgent()
        self.verification = VerificationAgent(self.crm)
        self.sales_agent = SalesAgent()
        #self.crm = crm

        # Initialize LLM
        self.llm = self._init_llm()

    def _init_llm(self):
        """Use a local lightweight conversational model — no token needed."""
        from transformers import pipeline
        return pipeline(
            "text-generation",
            model="microsoft/DialoGPT-medium",
            max_new_tokens=120,
            temperature=0.8
        )


    #def _init_llm(self):
    #    os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"
    #    return HuggingFaceHub(
     #       repo_id="meta-llama/Llama-2-7b-chat-hf",
    #        model_kwargs={"temperature": 0.7, "max_length": 256},
     #       task="text-generation"
     #   )

    def _extract_name(self, message: str) -> str:
        words = message.split()
        if len(words) <= 3:
            return message.title()
        return words[0].title()

    def handle_input(self, user_message: str, session: Dict) -> str:

        # ✅ If loan approved & user confirms → generate PDF
        if (self.pending_sanction and user_message.lower() in ["yes", "y"] and self.current_stage == "done"):
            file = self.sanction_agent.generate_sanction_letter(
                session["customer_data"], session["loan_application"]
            )
            self.pending_sanction = False
            return f"✅ Sanction letter generated successfully!\n📄 Saved as: {file}"

        # ✅ Stage 1: Ask name
        if self.current_stage == "welcome":
            name = self._extract_name(user_message)
            session["customer_data"]["name"] = name
            self.current_stage = "get_phone"
            return f"Nice to meet you, {name}! 😊 Please enter your registered mobile number."

         #✅ Stage 2: Ask phone
        #if self.current_stage == "get_phone":
        #    session["customer_data"]["phone"] = user_message
        #    self.current_stage = "get_purpose"
        #    return "Great! What is the purpose of your loan? (Education / Wedding / Home Renovation etc)"

        if self.current_stage == "get_phone":
           session["customer_data"]["phone"] = user_message
           self.current_stage = "sales_chat"
           return (
               "Perfect! 📞 Your number is verified.\n"
               "Let’s chat with our Sales Agent to understand your needs better 💬\n"
               "What brings you here today — home renovation, business, wedding, or something else?"
           )

        #🧠 Stage: Sales negotiation / persuasion phase
        if self.current_stage == "sales_chat":
            #Track number of turns inside sales discussion
           self.sales_stage += 1

            #STEP 1: First message — assess needs
           if self.sales_stage == 1:
               response = self.sales_agent.assess_needs(user_message, session)
               return response

            #STEP 2: Ask for amount
           elif self.sales_stage == 2:
               response = self.sales_agent.discuss_amount(user_message, session)
               return response

            #STEP 3: Ask for tenure
           elif self.sales_stage == 3:
               response = self.sales_agent.discuss_tenure(user_message, session)
               return response

            #STEP 4: Handle objections or confirmation
           elif self.sales_stage == 4:
               if any(word in user_message.lower() for word in ["yes", "ok", "proceed", "apply"]):
                   self.current_stage = "get_purpose"
                   return (
                       "Awesome 😎 Let's move forward with your application.\n"
                       "What is the purpose of your loan? (Education / Wedding / Home Renovation etc)"
                   )
               else:
                   response = self.sales_agent.handle_objection(user_message)
                   response += "\n\nWould you like me to proceed with your application?"
                   return response

            #STEP 5: Final closing — automatically move on
           elif self.sales_stage >= 5:
               self.current_stage = "get_purpose"
               closing = self.sales_agent.close_deal(session)
               return f"{closing}\n\nLet's continue with your application. What is the loan purpose?"


        # ✅ Stage 3: Loan purpose
        if self.current_stage == "get_purpose":
            session["customer_data"]["purpose"] = user_message
            self.current_stage = "get_amount"
            return "Understood ✅ Please enter the loan amount (in ₹):"

        # ✅ Stage 4: Loan amount
        if self.current_stage == "get_amount":
            try:
                amount = int(user_message)
                session["loan_application"]["amount"] = amount
                self.current_stage = "get_tenure"
                return "Great! Enter the loan tenure in months (12 / 24 / 36 / 48 etc):"
            except:
                return "⚠️ Please enter loan amount in numbers only."

        # Stage 6️⃣: Tenure → trigger UnderwritingAgent
        if self.current_stage == "get_tenure":
            try:
                tenure = int(user_message)
                session["loan_application"]["tenure"] = tenure

                result = self.underwriter.evaluate_application(
                    session["customer_data"], session["loan_application"]
                )
                if "rate" in result:
                    session["loan_application"]["rate"] = result["rate"]

                msg = result["message"]

                # If approved or needs salary slip
                if result["status"] == "approved":
                    session["loan_application"]["emi"] = result["emi"]
                    self.current_stage = "await_verification"
                    msg += "\n\n✅ Before generating your sanction letter, we need to verify your documents (PAN/Aadhaar). Please upload your PAN card PDF now."

                elif result["status"] == "requires_documents":
                    self.current_stage = "await_salary"
                    msg += "\nPlease upload your salary slip PDF now."

                return msg

            except:
                return "⚠️ Please enter tenure in numbers only."
            
        # Stage 7️⃣: Salary slip upload (simulate PDF reading)
        if self.current_stage == "await_salary":
            try:

                # ✅ Ensure the file exists
                filepath = user_message
                if not os.path.exists(filepath):
                    return f"⚠️ File not found: {filepath}"

                # ✅ Extract text from PDF
                reader = PdfReader(user_message)
                text = "".join([page.extract_text() or "" for page in reader.pages])

                # ✅ Clean weird symbols (■, •, etc.) and normalize spaces
                cleaned_text = re.sub(r"[^\w\s₹,.\-]", "", text)
                cleaned_text = re.sub(r"\s+", " ", cleaned_text)

                # ✅ Try extracting salary using flexible patterns
                salary_lines = re.findall(
                    r"(?:Net|Gross|Basic)\s*Salary[:\s₹]*([\d,]+)",
                    cleaned_text,
                    flags=re.IGNORECASE
                )

                if not salary_lines:
                    # Fallback for patterns like "Basic: 60000" or "Net Salary 70000"
                    salary_lines = re.findall(
                        r"(?:Net|Gross|Basic)[:\s₹]*([\d,]+)",
                        cleaned_text,
                        flags=re.IGNORECASE
                    )

                if salary_lines:
                    monthly_salary = float(salary_lines[-1].replace(",", ""))
                else:
                    # Secondary fallback if salary keyword missing but ₹ value exists
                    fallback = re.findall(r"₹\s?([\d,]+)", cleaned_text)
                    if fallback:
                        monthly_salary = float(fallback[-1].replace(",", ""))
                    else:
                        # 🔍 Return debug info to help verify extraction
                        return f"⚠️ Could not detect salary in the document. Text extracted: {cleaned_text[:150]}..."

                # ✅ Evaluate loan with extracted salary
                result = self.underwriter.evaluate_with_salary(
                    session["customer_data"],
                    session["loan_application"],
                    monthly_salary
                )

                if "rate" in result:
                    session["loan_application"]["rate"] = result["rate"]

                msg = result["message"]
                if result["status"] == "approved":
                    # ✅ Instead of moving straight to sanction, go to verification
                    self.current_stage = "await_verification"
                    msg += "\n\n✅ Before sanctioning, we’ll need to verify your documents (PAN/Aadhaar). Please upload your PAN card PDF now."
                elif result["status"] == "rejected":
                    self.current_stage = "done"
                else:
                    # e.g., needs docs or other instruction; keep user in await_salary
                    pass
                return msg

            except Exception as e:
                return f"⚠️ Error reading salary slip: {e}"
            
        # Stage 8️⃣: KYC Document Verification
        if self.current_stage == "await_verification":
            try:
                # Expecting user to upload PAN first
                document_type = "pan"
                response, ok = self.verification.verify_documents(document_type, user_message, session)

                if not ok:
                    return response  # Invalid doc → ask re-upload

                # ✅ Move to Aadhaar stage next
                self.current_stage = "await_aadhaar"
                return f"{response}\n\nNow please upload your Aadhaar card PDF for verification."

            except Exception as e:
                return f"⚠️ Error verifying PAN document: {e}"


        # Stage 9️⃣: Aadhaar Verification
        if self.current_stage == "await_aadhaar":
            try:
                document_type = "aadhaar"
                response, ok = self.verification.verify_documents(document_type, user_message, session)

                if not ok:
                    return response

                # ✅ If both verified → move to sanction letter stage
                self.pending_sanction = True
                self.current_stage = "done"
                return f"{response}\n\n✅ All KYC documents verified successfully!\nYou are now eligible for your sanction letter.\n\nType 'Yes' to generate it."

            except Exception as e:
                return f"⚠️ Error verifying Aadhaar document: {e}"

        # ✅ Add this import at the top of your file

        return "I'm here to assist you — continue 😊"


# ------------------ RUN TEST CHAT ------------------

if __name__ == "__main__":
    agent = MasterAgent()
    session = {"customer_data": {}, "loan_application": {}}

    print("🤖 SmartLoan AI Assistant Activated!\n")

    while True:
        user = input("You: ")
        reply = agent.handle_input(user, session)
        print("Agent:", reply)
