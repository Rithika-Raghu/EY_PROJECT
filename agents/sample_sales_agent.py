import os
import random
import uuid
from dataclasses import dataclass, field, asdict
from typing import Dict, Optional, Tuple, Any, List
import re
from PyPDF2 import PdfReader

class SalesAgent:
    """
    Sales Agent - Handles loan product discussion and negotiation
    Responsible for understanding customer needs and proposing loan terms
    """
    
    def __init__(self):
        self.agent_name = "Sales Agent"
        
    def assess_needs(self, message: str, session: Dict) -> str:
        """
        Understand customer's loan purpose and needs
        """
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
    
    def discuss_amount(self, message: str, session: Dict) -> str:
        """
        Discuss and negotiate loan amount
        """
        import re
        
        # Extract amount from message
        amount_match = re.findall(r'\d+', message.replace(',', ''))
        
        if amount_match:
            amount = int(''.join(amount_match))
            
            if amount < 50000:
                return f"I see you need ₹{amount:,}. For small amounts, we have instant approval! What loan tenure would be comfortable for you? (12, 24, 36, 48, or 60 months)"
            
            elif amount > 1000000:
                return f"₹{amount:,} is a significant amount. We can definitely help! For better terms, would you consider our secured loan products, or would you prefer to proceed with a personal loan? Also, what tenure works for you?"
            
            else:
                return f"Perfect! ₹{amount:,} is noted. Now, what loan tenure would be comfortable for you? We offer flexible tenures: 12, 24, 36, 48, or 60 months. Longer tenure means lower EMI!"
        
        return "Could you please specify the loan amount in numbers? For example: 500000 or 5 lakhs"
    
    def discuss_tenure(self, message: str, session: Dict) -> str:
        """
        Discuss loan tenure and calculate EMI
        """
        import re
        
        tenure_match = re.findall(r'\d+', message)
        
        if tenure_match:
            tenure = int(tenure_match[0])
            amount = session["loan_application"].get("amount", 0)
            
            if tenure in [12, 24, 36, 48, 60]:
                emi = self._calculate_emi(amount, tenure)
                
                return f"""Excellent choice! Here's your loan summary:

💰 Loan Amount: ₹{amount:,}
📅 Tenure: {tenure} months
💳 Estimated EMI: ₹{emi:,}/month
📊 Interest Rate: 10.5% p.a.
💵 Total Payable: ₹{emi * tenure:,}

Now, let me quickly verify your details for KYC. Could you please share your registered mobile number?"""
            
            else:
                return f"{tenure} months is noted, but we typically offer 12, 24, 36, 48, or 60 month tenures for better interest rates. Which of these would work best for you?"
        
        return "Please specify the tenure in months (12, 24, 36, 48, or 60 months)"
    
    def _calculate_emi(self, principal: float, tenure: int, rate: float = 10.5) -> int:
        """Calculate monthly EMI"""
        monthly_rate = rate / 12 / 100
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
        return int(emi)
    
    def handle_objection(self, objection: str) -> str:
        """
        Handle customer objections
        """
        objection_lower = objection.lower()
        
        if "interest" in objection_lower or "rate" in objection_lower:
            return "I understand your concern about interest rates. Our 10.5% p.a. is highly competitive! Plus, with a good credit score, you may qualify for even better rates. Shall we proceed with the application?"
        
        elif "emi" in objection_lower or "expensive" in objection_lower:
            return "I hear you! We can adjust the tenure to make the EMI more comfortable. Would you like to extend the loan period? This will reduce your monthly EMI significantly."
        
        elif "think" in objection_lower or "later" in objection_lower:
            return "Absolutely! Take your time. But keep in mind, our special pre-approved offer is valid for a limited time. I can hold this application for 48 hours. Should I do that?"
        
        return "I understand your concern. How can I help address it? We're here to find the best solution for you!"

