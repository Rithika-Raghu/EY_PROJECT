from typing import List, Dict, Optional
from datetime import datetime
import json

class CustomerRepository:
    """
    Customer data repository with synthetic data
    """
    
    def __init__(self):
        self.customers = self._load_synthetic_data()
    
    def _load_synthetic_data(self) -> Dict:
        """
        Load 10 synthetic customer profiles
        """
        return {
            "CUST001": {
                "name": "Rahul Sharma",
                "phone": "9876543210",
                "email": "rahul.sharma@email.com",
                "age": 32,
                "city": "Bangalore",
                "occupation": "Software Engineer",
                "monthly_income": 85000,
                "existing_loans": [
                    {"type": "Car Loan", "emi": 12000, "outstanding": 240000}
                ],
                "credit_score": 785,
                "pre_approved_limit": 500000,
                "created_at": "2023-01-15"
            },
            "CUST002": {
                "name": "Priya Patel",
                "phone": "9876543211",
                "email": "priya.patel@email.com",
                "age": 28,
                "city": "Ahmedabad",
                "occupation": "Business Owner",
                "monthly_income": 120000,
                "existing_loans": [],
                "credit_score": 820,
                "pre_approved_limit": 750000,
                "created_at": "2023-02-20"
            },
            "CUST003": {
                "name": "Amit Kumar",
                "phone": "9876543212",
                "email": "amit.kumar@email.com",
                "age": 35,
                "city": "Delhi",
                "occupation": "Marketing Manager",
                "monthly_income": 65000,
                "existing_loans": [
                    {"type": "Personal Loan", "emi": 8000, "outstanding": 150000},
                    {"type": "Credit Card", "emi": 5000, "outstanding": 45000}
                ],
                "credit_score": 690,
                "pre_approved_limit": 300000,
                "created_at": "2023-03-10"
            },
            "CUST004": {
                "name": "Sneha Singh",
                "phone": "9876543213",
                "email": "sneha.singh@email.com",
                "age": 30,
                "city": "Mumbai",
                "occupation": "HR Professional",
                "monthly_income": 75000,
                "existing_loans": [
                    {"type": "Home Loan", "emi": 18000, "outstanding": 2500000}
                ],
                "credit_score": 750,
                "pre_approved_limit": 600000,
                "created_at": "2023-04-05"
            },
            "CUST005": {
                "name": "Vijay Reddy",
                "phone": "9876543214",
                "email": "vijay.reddy@email.com",
                "age": 40,
                "city": "Hyderabad",
                "occupation": "Consultant",
                "monthly_income": 95000,
                "existing_loans": [
                    {"type": "Car Loan", "emi": 15000, "outstanding": 300000}
                ],
                "credit_score": 680,
                "pre_approved_limit": 250000,
                "created_at": "2023-05-12"
            },
            "CUST006": {
                "name": "Anita Desai",
                "phone": "9876543215",
                "email": "anita.desai@email.com",
                "age": 27,
                "city": "Pune",
                "occupation": "Data Analyst",
                "monthly_income": 90000,
                "existing_loans": [],
                "credit_score": 800,
                "pre_approved_limit": 700000,
                "created_at": "2023-06-18"
            },
            "CUST007": {
                "name": "Rajesh Gupta",
                "phone": "9876543216",
                "email": "rajesh.gupta@email.com",
                "age": 38,
                "city": "Kolkata",
                "occupation": "Teacher",
                "monthly_income": 55000,
                "existing_loans": [
                    {"type": "Education Loan", "emi": 6000, "outstanding": 180000}
                ],
                "credit_score": 720,
                "pre_approved_limit": 450000,
                "created_at": "2023-07-22"
            },
            "CUST008": {
                "name": "Meera Iyer",
                "phone": "9876543217",
                "email": "meera.iyer@email.com",
                "age": 33,
                "city": "Chennai",
                "occupation": "Nurse",
                "monthly_income": 48000,
                "existing_loans": [
                    {"type": "Two Wheeler Loan", "emi": 3000, "outstanding": 45000}
                ],
                "credit_score": 650,
                "pre_approved_limit": 200000,
                "created_at": "2023-08-30"
            },
            "CUST009": {
                "name": "Karan Mehta",
                "phone": "9876543218",
                "email": "karan.mehta@email.com",
                "age": 29,
                "city": "Jaipur",
                "occupation": "Architect",
                "monthly_income": 78000,
                "existing_loans": [],
                "credit_score": 790,
                "pre_approved_limit": 650000,
                "created_at": "2023-09-14"
            },
            "CUST010": {
                "name": "Pooja Nair",
                "phone": "9876543219",
                "email": "pooja.nair@email.com",
                "age": 31,
                "city": "Kochi",
                "occupation": "Pharmacist",
                "monthly_income": 62000,
                "existing_loans": [
                    {"type": "Personal Loan", "emi": 7000, "outstanding": 120000}
                ],
                "credit_score": 760,
                "pre_approved_limit": 550000,
                "created_at": "2023-10-08"
            }
        }
    
    def get_customer_by_phone(self, phone: str) -> Optional[Dict]:
        """Get customer data by phone number"""
        for cust_id, data in self.customers.items():
            if data['phone'] == phone:
                return {**data, 'customer_id': cust_id}
        return None
    
    def get_all_customers(self) -> List[Dict]:
        """Get all customers"""
        return [
            {**data, 'customer_id': cust_id}
            for cust_id, data in self.customers.items()
        ]