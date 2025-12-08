# import os
# import random
# import uuid
# from dataclasses import dataclass, field, asdict
# from typing import Dict, Optional, Tuple, Any, List

# class CRMService:
#     """
#     Mock CRM service for customer data verification
#     """
    
#     def __init__(self):
#         # Synthetic customer database
#         self.customer_database = {
#             "9876543210": {
#                 "name": "Rahul Sharma",
#                 "email": "rahul.sharma@email.com",
#                 "address": "123, MG Road, Bangalore, Karnataka - 560001",
#                 "dob": "1990-05-15",
#                 "pan": "ABCDE1234F",
#                 "existing_customer": True
#             },
#             "9876543211": {
#                 "name": "Priya Patel",
#                 "email": "priya.patel@email.com",
#                 "address": "456, SG Highway, Ahmedabad, Gujarat - 380015",
#                 "dob": "1988-08-22",
#                 "pan": "FGHIJ5678K",
#                 "existing_customer": True
#             },
#             # Add more synthetic customers
#         }
    
#     def verify_phone(self, phone: str) -> bool:
#         """
#         Verify if phone number exists in CRM
#         """
#         return phone in self.customer_database
    
#     def verify_address(self, address: str) -> bool:
#         """
#         Verify address format
#         """
#         # Simple validation - address should have minimum length
#         return len(address) > 20
    
#     def get_customer_data(self, phone: str) -> Dict:
#         """
#         Fetch customer data from CRM
#         """
#         return self.customer_database.get(phone, {})
    
#     def update_customer_data(self, phone: str, data: Dict):
#         """
#         Update customer information
#         """
#         if phone in self.customer_database:
#             self.customer_database[phone].update(data)
#         else:
#             self.customer_database[phone] = data

class CRMService:
    """
    CRM service now uses database instead of in-memory dict
    Simulates a Customer Relationship Management system
    """
    
    def __init__(self, database_service):
        """Initialize CRM with database service"""
        self.db = database_service
        print("✅ CRM Service initialized with database")
    
    def get_customer_data(self, phone):
        """Fetch customer data from persistent database"""
        customer = self.db.get_customer_by_phone(phone)
        if customer:
            return {
                "name": customer["name"],
                "phone": customer["phone"],
                "city": customer["city"],
                "email": customer["email"],
                "age": customer["age"],
                "existing_customer": True
            }
        return None
    
    def verify_customer(self, phone):
        """Check if customer exists in database"""
        return self.db.get_customer_by_phone(phone) is not None
    
    def get_customer_credit_profile(self, phone):
        """Get customer credit profile from database"""
        customer = self.db.get_customer_by_phone(phone)
        if customer:
            return {
                "credit_score": customer["credit_score"],
                "pre_approved_limit": customer["pre_approved_limit"],
                "existing_loan_amount": customer["existing_loan_amount"],
                "monthly_salary": customer["monthly_salary"]
            }
        return None
