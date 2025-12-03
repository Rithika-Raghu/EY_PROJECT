from typing import Dict

class UnderwritingAgent:
    """
    Lightweight underwriting rules for development/testing.
    """

    def __init__(self, credit_bureau, offer_mart):
        self.credit_bureau = credit_bureau
        self.offer_mart = offer_mart

    def evaluate_application(self, customer_data: Dict, loan_application: Dict) -> Dict:
        """
        Basic rule-based evaluation:
        - if amount absent -> ask for amount
        - if amount <= 500000 -> provisional approve
        - else require salary docs
        """
        amount = loan_application.get("amount", 0)
        if not amount or amount == 0:
            return {"status": "needs_info", "message": "Please provide the loan amount."}

        # quick heuristic
        if amount <= 500000:
            # compute dummy EMI using fixed rate 10.5% and tenure if provided
            tenure = loan_application.get("tenure", 12)
            rate = 10.5
            emi = self._calculate_emi(amount, tenure, rate)
            return {
                "status": "approved",
                "message": f"✅ Your loan can be approved subject to KYC. Estimated EMI: ₹{emi:,}",
                "emi": emi,
                "rate": rate
            }
        else:
            # request salary slip for larger amounts
            return {"status": "requires_documents", "message": "For higher amounts we need a salary slip to proceed."}

    def evaluate_with_salary(self, customer_data: Dict, loan_application: Dict, monthly_salary: float) -> Dict:
        """
        With salary present, make a decision:
        - if monthly_salary * 10 >= amount -> approve
        - else reject
        """
        amount = loan_application.get("amount", 0)
        if not amount:
            return {"status": "needs_info", "message": "Loan amount missing."}

        if monthly_salary * 10 >= amount:
            tenure = loan_application.get("tenure", 12)
            rate = 10.5
            emi = self._calculate_emi(amount, tenure, rate)
            return {
                "status": "approved",
                "message": f"✅ Based on your salary, the loan looks approvable. Estimated EMI: ₹{emi:,}",
                "emi": emi,
                "rate": rate
            }
        else:
            return {"status": "rejected", "message": "Sorry, your salary doesn't meet our minimum requirement for this amount."}

    def _calculate_emi(self, principal: float, tenure: int, rate: float = 10.5) -> int:
        monthly_rate = rate / 12 / 100
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
        return int(emi)
