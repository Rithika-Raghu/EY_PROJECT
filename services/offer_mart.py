from typing import Dict, List
class OfferMartService:
    """
    Offer Mart - Manages pre-approved loan offers
    """
    
    def __init__(self):
        # Pre-approved offers database
        self.offers_database = {
            "9876543210": {"limit": 500000, "rate": 10.5, "tenure_options": [12, 24, 36, 48, 60]},
            "9876543211": {"limit": 750000, "rate": 10.0, "tenure_options": [12, 24, 36, 48, 60]},
            "9876543212": {"limit": 300000, "rate": 11.0, "tenure_options": [12, 24, 36]},
            "9876543213": {"limit": 600000, "rate": 10.5, "tenure_options": [12, 24, 36, 48, 60]},
            "9876543214": {"limit": 250000, "rate": 11.5, "tenure_options": [12, 24, 36]},
            "9876543215": {"limit": 700000, "rate": 10.0, "tenure_options": [12, 24, 36, 48, 60]},
            "9876543216": {"limit": 450000, "rate": 10.5, "tenure_options": [12, 24, 36, 48]},
            "9876543217": {"limit": 200000, "rate": 12.0, "tenure_options": [12, 24, 36]},
            "9876543218": {"limit": 650000, "rate": 10.0, "tenure_options": [12, 24, 36, 48, 60]},
            "9876543219": {"limit": 550000, "rate": 10.5, "tenure_options": [12, 24, 36, 48, 60]},
        }
    
    def get_pre_approved_limit(self, customer_data: Dict) -> float:
        """
        Get pre-approved loan limit for customer
        """
        phone = customer_data.get("phone", "")
        
        if phone in self.offers_database:
            return self.offers_database[phone]["limit"]
        
        # Default for new customers
        return 300000
    
    def get_interest_rate(self, customer_data: Dict, amount: float) -> float:
        """
        Get applicable interest rate
        """
        phone = customer_data.get("phone", "")
        
        if phone in self.offers_database:
            return self.offers_database[phone]["rate"]
        
        # Default rate
        return 10.5
    
    def get_personalized_offers(self, customer_data: Dict) -> List[Dict]:
        """
        Generate personalized loan offers
        """
        phone = customer_data.get("phone", "")
        base_limit = self.get_pre_approved_limit(customer_data)
        
        offers = [
            {
                "type": "Quick Cash",
                "amount": int(base_limit * 0.3),
                "tenure": 12,
                "rate": 10.0,
                "emi": self._calculate_emi(int(base_limit * 0.3), 12, 10.0),
                "feature": "Instant Approval"
            },
            {
                "type": "Standard Loan",
                "amount": int(base_limit * 0.6),
                "tenure": 24,
                "rate": 10.5,
                "emi": self._calculate_emi(int(base_limit * 0.6), 24, 10.5),
                "feature": "Flexible Tenure"
            },
            {
                "type": "Premium Loan",
                "amount": base_limit,
                "tenure": 48,
                "rate": 11.0,
                "emi": self._calculate_emi(base_limit, 48, 11.0),
                "feature": "Low EMI"
            }
        ]
        
        return offers
    
    def _calculate_emi(self, principal: float, tenure: int, rate: float) -> int:
        """Calculate EMI"""
        monthly_rate = rate / 12 / 100
        emi = principal * monthly_rate * (1 + monthly_rate) ** tenure / ((1 + monthly_rate) ** tenure - 1)
        return int(emi)