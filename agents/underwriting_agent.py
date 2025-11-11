from typing import Dict, Any
from datetime import datetime
import random

class UnderwritingAgent:
    """
    Underwriting Agent - Credit assessment and loan eligibility
    Fetches credit scores and evaluates loan approval criteria
    """
    
    def __init__(self, credit_bureau, offer_mart):
        self.agent_name = "Underwriting Agent"
        self.credit_bureau = credit_bureau
        self.offer_mart = offer_mart
        
    def evaluate_application(self, customer_data: Dict, loan_application: Dict) -> Dict:
        """
        Main evaluation logic for loan application
        """
        # Fetch credit score
        credit_score = self.credit_bureau.get_credit_score(customer_data.get("phone"))
        
        # Get pre-approved limit
        pre_approved_limit = self.offer_mart.get_pre_approved_limit(customer_data)
        
        requested_amount = loan_application.get("amount", 0)
        
        # Credit score check
        if credit_score < 700:
            return {
                "status": "rejected",
                "reason": "credit_score_low",
                "message": f"""❌ Credit Assessment Results:

• Credit Score: {credit_score}/900 (Below threshold)
• Required Score: 700+
• Status: Application Declined

We're unable to approve your loan at this time due to credit score requirements. However, we can help you improve your score!

Would you like tips on improving your credit score? 📈""",
                "credit_score": credit_score
            }
        
        # Eligibility logic
        if requested_amount <= pre_approved_limit:
            # Instant approval
            return self._instant_approval(customer_data, loan_application, credit_score, pre_approved_limit)
        
        elif requested_amount <= (pre_approved_limit * 2):
            # Requires salary slip
            return self._requires_salary_slip(customer_data, loan_application, credit_score, pre_approved_limit)
        
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

The requested amount is above your pre-approved limit. However, you can:
1. Apply for ₹{pre_approved_limit:,} with instant approval
2. Provide income proof for higher amount consideration

Would you like to proceed with ₹{pre_approved_limit:,}?""",
                "credit_score": credit_score,
                "max_eligible": pre_approved_limit
            }
    
    def _instant_approval(self, customer_data: Dict, loan_application: Dict, 
                         credit_score: int, pre_approved_limit: float) -> Dict:
        """
        Instant approval flow
        """
        requested_amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 12)
        emi = self._calculate_emi(requested_amount, tenure)
        
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
            "emi": emi,
            "loan_details": {
                "amount": requested_amount,
                "tenure": tenure,
                "rate": 10.5,
                "emi": emi,
                "processing_fee": int(requested_amount * 0.02)
            }
        }
    
    def _requires_salary_slip(self, customer_data: Dict, loan_application: Dict,
                             credit_score: int, pre_approved_limit: float) -> Dict:
        """
        Requires salary slip for approval
        """
        requested_amount = loan_application.get("amount", 0)
        
        return {
            "status": "requires_documents",
            "documents_needed": ["salary_slip"],
            "message": f"""📋 Credit Assessment Results:

• Credit Score: {credit_score}/900 ✅
• Pre-approved Limit: ₹{pre_approved_limit:,}
• Requested Amount: ₹{requested_amount:,}
• Status: CONDITIONAL APPROVAL

Your credit score is excellent! However, for amounts above your pre-approved limit, we need to verify your income.

📎 Please upload your latest salary slip to proceed.

We'll ensure your EMI doesn't exceed 50% of your monthly salary for comfortable repayment. 💼""",
            "credit_score": credit_score
        }
    
    def evaluate_with_salary(self, customer_data: Dict, loan_application: Dict, 
                            monthly_salary: float) -> Dict:
        """
        Evaluate application after salary slip upload
        """
        requested_amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 12)
        emi = self._calculate_emi(requested_amount, tenure)
        
        # Check if EMI <= 50% of salary
        if emi <= (monthly_salary * 0.5):
            return {
                "status": "approved",
                "approval_type": "conditional",
                "message": f"""✅ LOAN APPROVED! 🎉

📊 Final Assessment:
• Monthly Salary: ₹{monthly_salary:,}
• Proposed EMI: ₹{emi:,}
• EMI to Income Ratio: {(emi/monthly_salary*100):.1f}%
• Status: APPROVED ✅

Your application meets all our criteria! Would you like to proceed with the sanction letter?""",
                "emi": emi,
                "salary": monthly_salary
            }
        else:
            return {
                "status": "rejected",
                "reason": "emi_exceeds_income",
                "message": f"""❌ Assessment Update:

• Monthly Salary: ₹{monthly_salary:,}
• Proposed EMI: ₹{emi:,}
• EMI to Income Ratio: {(emi/monthly_salary*100):.1f}%
• Maximum Allowed: 50%

The EMI exceeds our policy limit. We can offer:
• Lower loan amount: ₹{int(monthly_salary * 0.5 * tenure / 1.1):,}
• Extended tenure to reduce EMI

Would you like to explore these options?""",
                "emi": emi,
                "max_eligible_amount": int(monthly_salary * 0.5 * tenure / 1.1)
            }
    
    def _calculate_emi(self, principal: float, tenure: int, rate: float = 10.5) -> int:
        """Calculate EMI"""
        monthly_rate = rate / 12 / 100
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
        return int(emi)