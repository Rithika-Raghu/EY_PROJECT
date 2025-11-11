import random
from typing import Dict

class CreditBureauAPI:
    """
    Mock Credit Bureau API for fetching credit scores
    """
    
    def __init__(self):
        # Synthetic credit data for 10 customers
        self.credit_database = {
            "9876543210": {"score": 785, "name": "Rahul Sharma", "pre_approved": 500000},
            "9876543211": {"score": 820, "name": "Priya Patel", "pre_approved": 750000},
            "9876543212": {"score": 690, "name": "Amit Kumar", "pre_approved": 300000},
            "9876543213": {"score": 750, "name": "Sneha Singh", "pre_approved": 600000},
            "9876543214": {"score": 680, "name": "Vijay Reddy", "pre_approved": 250000},
            "9876543215": {"score": 800, "name": "Anita Desai", "pre_approved": 700000},
            "9876543216": {"score": 720, "name": "Rajesh Gupta", "pre_approved": 450000},
            "9876543217": {"score": 650, "name": "Meera Iyer", "pre_approved": 200000},
            "9876543218": {"score": 790, "name": "Karan Mehta", "pre_approved": 650000},
            "9876543219": {"score": 760, "name": "Pooja Nair", "pre_approved": 550000},
        }
    
    def get_credit_score(self, phone: str) -> int:
        """
        Fetch credit score from bureau
        """
        # Check if customer exists in database
        if phone in self.credit_database:
            return self.credit_database[phone]["score"]
        
        # Generate random score for new customers
        return random.randint(650, 850)
    
    def get_credit_report(self, phone: str) -> Dict:
        """
        Get detailed credit report
        """
        if phone in self.credit_database:
            data = self.credit_database[phone]
            return {
                "score": data["score"],
                "name": data["name"],
                "active_loans": random.randint(0, 3),
                "credit_cards": random.randint(1, 4),
                "payment_history": "Excellent" if data["score"] > 750 else "Good",
                "credit_utilization": f"{random.randint(20, 60)}%",
                "enquiries_last_6m": random.randint(0, 3)
            }
        
        return {
            "score": random.randint(650, 850),
            "name": "New Customer",
            "active_loans": 1,
            "credit_cards": 2,
            "payment_history": "Good",
            "credit_utilization": "35%",
            "enquiries_last_6m": 1
        }
