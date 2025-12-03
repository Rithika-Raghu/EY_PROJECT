import re

class SalesAgent:
    """
    SalesAgent handles the customer-facing conversation:
      start -> purpose -> amount -> tenure -> complete

    It writes structured data to session["loan_application"] so MasterAgent
    can pick it up after the sales flow finishes.
    """

    def __init__(self):
        self.conversation_state = "start"   # start / purpose / amount / tenure / complete
        self.loan_purpose = None
        self.loan_amount = None
        self.loan_tenure = None

    # ---------------------------
    # Conversation helpers
    # ---------------------------
    def reset(self):
        self.conversation_state = "start"
        self.loan_purpose = None
        self.loan_amount = None
        self.loan_tenure = None

    def detect_rate_query(self, text: str) -> bool:
        kws = ["rate", "emi", "pricing", "cost", "charges", "price", "fee", "interest"]
        return any(k in (text or "").lower() for k in kws)

    def handle_objection(self, message: str) -> str:
        # Simple canned response — you can expand this to call an LLM or calculator
        return (
            "If you'd like an estimated EMI or interest rate, tell me the amount and tenure "
            "you're considering (e.g., 200000 for 24 months), and I'll provide an estimate."
        )

    def parse_amount_text(self, text: str) -> int | None:
        if not text:
            return None

        t = text.lower().replace(" ", "")
        # direct numbers (with commas or rupee symbol)
        m = re.search(r"₹?\s*([\d,]+(?:\.\d+)?)", text.replace("\u20B9", "₹"))
        if m:
            num = m.group(1).replace(",", "")
            try:
                return int(float(num))
            except:
                pass

        # shorthand like 200k
        m = re.search(r"(\d+(\.\d+)?)\s*k\b", t)
        if m:
            return int(float(m.group(1)) * 1000)

        # lakhs: 2 lakh, 2.5 lakh, 2l
        m = re.search(r"(\d+(\.\d+)?)\s*(lakh|lac|l)\b", t)
        if m:
            return int(float(m.group(1)) * 100000)

        # fallback: any 4+ digit number in text
        m = re.search(r"(\d{4,})", t)
        if m:
            try:
                return int(m.group(1))
            except:
                pass

        return None

    def extract_tenure_months(self, message: str) -> int | None:
        if not message:
            return None
        mnums = re.findall(r"\d+", message)
        if not mnums:
            return None
        n = int(mnums[0])
        low = message.lower()
        if "year" in low or "yr" in low or "y" in low and n <= 30:
            return n * 12
        # otherwise assume months
        return n

    # ---------------------------
    # Main state-machine
    # ---------------------------
    def talk(self, message: str, session: dict) -> str:
        """
        Drive the sales conversation.
        Writes structured fields into session["loan_application"].
        """
        message = (message or "").strip()
        # restore state from session if present
        if "sales_state" in session:
            self.conversation_state = session["sales_state"]
            self.loan_purpose = session.get("loan_purpose", self.loan_purpose)
            self.loan_amount = session.get("loan_amount", self.loan_amount)
            self.loan_tenure = session.get("loan_tenure", self.loan_tenure)
            # support both legacy session keys and loan_application dict
            la = session.get("loan_application", {})
            if "amount" in la:
                self.loan_amount = la.get("amount")
            else:
                self.loan_amount = session.get("loan_amount", self.loan_amount)
            if "tenure" in la:
                self.loan_tenure = la.get("tenure")
            else:
                self.loan_tenure = session.get("loan_tenure", self.loan_tenure)

        # Defensive ensure dict exists
        if "loan_application" not in session:
            session["loan_application"] = {}

        # If user typed amount/tenure out of order, accept it:
        parsed_amount = self.parse_amount_text(message)
        parsed_tenure = self.extract_tenure_months(message)

        # If parsed_amount found while we haven't collected purpose, keep it but still ask purpose
# SALES_AGENT SHOULD NOT ASK PURPOSE IF MASTER_AGENT ALREADY COLLECTED IT
        if self.conversation_state == "start":
            if session.get("loan_purpose"):  
                # Purpose already collected → jump directly to AMOUNT stage
                self.conversation_state = "amount"
                session["sales_state"] = "amount"
                return "Great 😊 Now tell me the loan amount you are looking for (e.g., 200000, 2 lakh, or 200k)."

            # otherwise SalesAgent handles purpose normally
            self.conversation_state = "purpose"
            session["sales_state"] = "purpose"
            return "Great 😊 What brings you here today — home renovation, business, wedding, or something else?"

        # PURPOSE state: accept purpose or if user gave amount first, save and then ask for purpose
        if self.conversation_state == "purpose":
            # if user supplied an amount first (e.g., "200000"), accept but still ask purpose
            if parsed_amount and not message.lower().startswith(("i'm","i am","for","purpose","because")):
                # store amount but prompt for purpose
                self.loan_amount = int(parsed_amount)
                session["loan_application"]["amount"] = int(parsed_amount)
                session["loan_amount"] = int(parsed_amount)
                # remain in purpose state (we still need purpose)
                return "Thanks — got the amount. Before we continue, what brings you here today (purpose)?"
            # normal path: store purpose and move to amount
            self.loan_purpose = message
            session["loan_purpose"] = message
            self.conversation_state = "amount"
            session["sales_state"] = "amount"
            return "Great 😊 Now tell me the loan amount you are looking for (e.g., 200000, 2 lakh, or 200k)."

        # AMOUNT state: accept amount (either parsed or numeric)
        if self.conversation_state == "amount":
            # if message contains amount
            if parsed_amount:
                self.loan_amount = int(parsed_amount)
                session["loan_application"]["amount"] = int(parsed_amount)
                session["loan_amount"] = int(parsed_amount)
                # move to tenure
                self.conversation_state = "tenure"
                session["sales_state"] = "tenure"
                return f"Perfect! I've noted ₹{int(parsed_amount):,}. Now, how long would you like the tenure? (e.g., 12 / 24 / 36 months)"
            # user might type "ok" or "sure" -> nudge
            if message.lower() in ("ok", "okay", "sure", "yes", "proceed", "continue"):
                return "Great 😊 Please tell me the loan amount you are looking for (e.g., 200000, 2 lakh, or 200k)."
            return "Please provide the loan amount in numbers (e.g., 200000)."

        # TENURE state: accept tenure, then complete
        if self.conversation_state == "tenure":
            # if user provided tenure in same message
            if parsed_tenure:
                self.loan_tenure = int(parsed_tenure)
                session["loan_application"]["tenure"] = int(parsed_tenure)
                session["loan_tenure"] = int(parsed_tenure)

                # mark complete
                self.conversation_state = "complete"
                session["sales_state"] = "complete"

                # ensure amount exists in loan_application (defensive)
                if "amount" not in session["loan_application"] and self.loan_amount:
                    session["loan_application"]["amount"] = int(self.loan_amount)

                return (
                    f"Great! 📝 I have taken your details.\n\n"
                    f"• Purpose: {self.loan_purpose}\n"
                    f"• Amount: ₹{session['loan_application'].get('amount', 'N/A')}\n"
                    f"• Tenure: {session['loan_application'].get('tenure', 'N/A')} months\n\n"
                    f"Let me pass this to our team for evaluation."
                )
            # ask for tenure
            if message.lower() in ("ok", "okay", "sure", "yes"):
                return "Please tell me the tenure in months (e.g., 12, 24, 36)."
            return "Please provide tenure in months (e.g., 12, 24, 36)."

        # COMPLETE state: keep user informed
        if self.conversation_state == "complete":
            return "Thanks — I'm processing your details and will hand them over for evaluation."

        # Fallback
        return "Something went wrong in the sales flow. Let's start again."
    def calculate_emi(self, principal: float, annual_rate: float, tenure_months: int) -> float:
        """
        Calculate EMI for a loan.
        
        principal: loan amount
        annual_rate: annual interest rate in percent (e.g., 12 for 12%)
        tenure_months: tenure in months

        Returns EMI as float.
        """
        if principal <= 0 or annual_rate <= 0 or tenure_months <= 0:
            return 0.0

        monthly_rate = annual_rate / 12 / 100  # convert annual % to monthly fraction
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure_months / ((1 + monthly_rate) ** tenure_months - 1)
        return round(emi, 2)

    def handle_objection(self, message: str, session: dict) -> str:
        """
        Respond to EMI/rate questions.
        """
        amount = session.get("loan_application", {}).get("amount")
        tenure = session.get("loan_application", {}).get("tenure")
        if amount and tenure:
            # default interest rate if not known
            rate = session.get("loan_application", {}).get("rate", 12.0)
            emi = self.calculate_emi(amount, rate, tenure)
            return f"For ₹{amount:,} over {tenure} months at {rate}% p.a., your estimated EMI is ₹{emi:,}."
        return (
            "If you'd like an estimated EMI or interest rate, tell me the amount and tenure "
            "you're considering (e.g., 200000 for 24 months), and I'll provide an estimate."
        )
