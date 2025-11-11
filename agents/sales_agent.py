import re
from typing import Dict
from langchain_community.llms import HuggingFaceHub
from langchain_huggingface import HuggingFaceEndpoint
from transformers import pipeline


class SalesAgent:
    """
    Sales Agent – Handles customer needs, negotiates terms, and persuades the customer.
    """

    #def __init__(self):
    #    self.agent_name = "Sales Agent"
    #    self.llm = self._init_llm()

    def __init__(self):
        self.agent_name = "Sales Agent"
        self.llm = self._init_llm()

    # ---------------------- MODEL SETUP ----------------------
    def _init_llm(self):
        """Initialize a local text-generation pipeline (offline & free)."""
        return pipeline(
            "text-generation",
            model="microsoft/DialoGPT-medium",   # small and free conversational model
            max_new_tokens=120,
            temperature=0.8
        )

    def _chat_response(self, prompt: str) -> str:
        """Generate conversational responses locally."""
        try:
            response = self.llm(prompt, max_new_tokens=120, temperature=0.8)
            return response[0]["generated_text"].strip()
        except Exception:
            return "I understand! Let's find a plan that suits you."

    def _persuasive_response(self, context: str, goal: str = "convince") -> str:
        """
        Generate a persuasive, natural sales-style message.
        """
        prompt = (
            f"You are a persuasive and empathetic loan sales officer. Your goal is to {goal} the customer. "
            f"Context: {context}\n"
            "Respond like a professional human agent — concise, emotionally intelligent, "
            "with a reassuring tone. Always end with a question or next step."
        )
        reply = self._chat_response(prompt)
        return reply or "I completely understand. Shall I show you a few options that could lower your EMI?"

    # ---------------------- CORE LOGIC ----------------------

    def assess_needs(self, message: str, session: Dict) -> str:
        """
        Understand customer's loan purpose and begin pitch.
        """
        purpose = message.strip().lower()

        responses = {
            "home": "Home renovation is a wonderful investment! 🏠 It not only improves your space but adds property value too.",
            "education": "Education is the best investment you can make! 🎓 We have affordable education loan options for you.",
            "wedding": "Congratulations on your wedding plans! 💍 Let’s make it special without worrying about expenses.",
            "business": "Expanding your business? 💼 That's exciting! We can fund your next step easily.",
            "medical": "Health is priceless. 🏥 We’ll make sure finances don’t slow down your recovery.",
            "debt": "Smart choice! Consolidating loans can help you save on interest payments. 💰"
        }

        for key, response in responses.items():
            if key in purpose:
                return f"{response}\n\nHow much loan amount are you looking for?"

        return f"Got it! {message.capitalize()} sounds like a great goal. 💡 How much loan amount would you like to apply for?"

    def discuss_amount(self, message: str, session: Dict) -> str:
        """Discuss loan amount and set expectations."""
        amount_match = re.findall(r'\d+', message.replace(',', ''))
        if amount_match:
            amount = int(''.join(amount_match))
            session["loan_application"]["amount"] = amount

            if amount < 50000:
                return f"₹{amount:,} — that’s well within our instant approval range! ⚡ What tenure would you prefer? (12, 24, 36, 48, or 60 months)"

            elif amount > 1000000:
                context = f"Customer asked for ₹{amount:,}, which is above the usual limit. Offer secured options or convince for a smaller amount."
                return self._persuasive_response(context, goal="negotiate")

            else:
                return f"Perfect! ₹{amount:,} noted. 💰 What tenure would be most comfortable for you — 12, 24, 36, 48, or 60 months?"

        return "Could you please mention the loan amount in numbers? For example: 500000 or 5 lakhs."

    def discuss_tenure(self, message: str, session: Dict) -> str:
        """Discuss tenure and calculate EMI."""
        tenure_match = re.findall(r'\d+', message)
        if not tenure_match:
            return "Please specify the tenure in months (12, 24, 36, 48, or 60)."

        tenure = int(tenure_match[0])
        amount = session["loan_application"].get("amount", 0)

        if tenure not in [12, 24, 36, 48, 60]:
            return f"We usually offer 12, 24, 36, 48, or 60-month plans for best rates. Which one suits you best?"

        emi = self._calculate_emi(amount, tenure)
        session["loan_application"]["tenure"] = tenure
        session["loan_application"]["emi"] = emi
        session["loan_application"]["rate"] = 10.5

        context = (
            f"Loan amount ₹{amount:,}, tenure {tenure} months, EMI ₹{emi:,}. "
            "Encourage the customer to confirm or explore other options."
        )
        persuasive_msg = self._persuasive_response(context, goal="convince")

        return f"""Here’s a quick summary for you:

💰 Loan Amount: ₹{amount:,}
📅 Tenure: {tenure} months
💳 Estimated EMI: ₹{emi:,}/month
📊 Interest Rate: 10.5% p.a.
💵 Total Payable: ₹{emi * tenure:,}

{persuasive_msg}"""

    def _calculate_emi(self, principal: float, tenure: int, rate: float = 10.5) -> int:
        """Calculate monthly EMI."""
        monthly_rate = rate / 12 / 100
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
        return int(emi)

    def handle_objection(self, objection: str) -> str:
        """Handle objections with empathy."""
        objection_lower = objection.lower()

        if "interest" in objection_lower or "rate" in objection_lower:
            context = "Customer feels interest rate is high — justify with trust, stability, and long-term value."
            return self._persuasive_response(context, goal="convince")

        elif "emi" in objection_lower or "expensive" in objection_lower:
            context = "Customer thinks EMI is too high — offer to adjust tenure or lower amount."
            return self._persuasive_response(context, goal="negotiate")

        elif "think" in objection_lower or "later" in objection_lower:
            context = "Customer is hesitant — create urgency politely and reassure them."
            return self._persuasive_response(context, goal="close")

        context = f"Customer objection: '{objection}'. Respond calmly and keep engagement alive."
        return self._persuasive_response(context, goal="convince")

    def close_deal(self, session: Dict) -> str:
        """Closing the deal positively."""
        summary = session.get("loan_application", {})
        context = (
            f"Customer agreed to loan ₹{summary.get('amount', 0):,} for {summary.get('tenure', 0)} months. "
            "Reinforce trust and excitement about approval."
        )
        return self._persuasive_response(context, goal="close")
