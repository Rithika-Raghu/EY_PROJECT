import sqlite3
import json
from datetime import datetime
import os

class DatabaseService:
    """Persistent database with 10 pre-seeded customers"""
    
    def __init__(self, db_path="loan_system.db"):
        self.db_path = db_path
        self.conn = None
        self.initialize_database()
    
    def initialize_database(self):
        """Create tables and seed data if database doesn't exist"""
        is_new_db = not os.path.exists(self.db_path)
        
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        cursor = self.conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                age INTEGER,
                city TEXT,
                email TEXT,
                pan_number TEXT,
                aadhaar_number TEXT,
                credit_score INTEGER,
                monthly_salary REAL,
                pre_approved_limit REAL,
                existing_loan_amount REAL,
                created_at TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS loan_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_phone TEXT,
                amount REAL,
                tenure INTEGER,
                purpose TEXT,
                interest_rate REAL,
                emi REAL,
                status TEXT,
                created_at TEXT,
                FOREIGN KEY(customer_phone) REFERENCES customers(phone)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_phone TEXT,
                doc_type TEXT,
                doc_path TEXT,
                verified BOOLEAN,
                verified_at TEXT,
                FOREIGN KEY(customer_phone) REFERENCES customers(phone)
            )
        ''')
        
        self.conn.commit()
        
        # Seed dummy data only if database is new
        if is_new_db:
            self._seed_dummy_customers()
            print("✅ Database initialized with 10 dummy customers!")
        else:
            print("✅ Connected to existing database!")
    
    def _seed_dummy_customers(self):
        """Seed 10 dummy customers with realistic data"""
        dummy_customers = [
            {
                "phone": "9876543210",
                "name": "Rajesh Kumar",
                "age": 32,
                "city": "Mumbai",
                "email": "rajesh.kumar@email.com",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "1234-5678-9012",
                "credit_score": 780,
                "monthly_salary": 75000,
                "pre_approved_limit": 500000,
                "existing_loan_amount": 0
            },
            {
                "phone": "9876543211",
                "name": "Priya Sharma",
                "age": 28,
                "city": "Delhi",
                "email": "priya.sharma@email.com",
                "pan_number": "FGHIJ5678K",
                "aadhaar_number": "2345-6789-0123",
                "credit_score": 820,
                "monthly_salary": 95000,
                "pre_approved_limit": 700000,
                "existing_loan_amount": 100000
            },
            {
                "phone": "9876543212",
                "name": "Amit Patel",
                "age": 35,
                "city": "Ahmedabad",
                "email": "amit.patel@email.com",
                "pan_number": "KLMNO9012P",
                "aadhaar_number": "3456-7890-1234",
                "credit_score": 750,
                "monthly_salary": 65000,
                "pre_approved_limit": 400000,
                "existing_loan_amount": 50000
            },
            {
                "phone": "9876543213",
                "name": "Sneha Reddy",
                "age": 29,
                "city": "Hyderabad",
                "email": "sneha.reddy@email.com",
                "pan_number": "QRSTU3456V",
                "aadhaar_number": "4567-8901-2345",
                "credit_score": 690,
                "monthly_salary": 55000,
                "pre_approved_limit": 300000,
                "existing_loan_amount": 0
            },
            {
                "phone": "9876543214",
                "name": "Vikram Singh",
                "age": 40,
                "city": "Bangalore",
                "email": "vikram.singh@email.com",
                "pan_number": "WXYZB7890C",
                "aadhaar_number": "5678-9012-3456",
                "credit_score": 850,
                "monthly_salary": 120000,
                "pre_approved_limit": 1000000,
                "existing_loan_amount": 200000
            },
            {
                "phone": "9876543215",
                "name": "Anita Desai",
                "age": 26,
                "city": "Pune",
                "email": "anita.desai@email.com",
                "pan_number": "DEFGH1234I",
                "aadhaar_number": "6789-0123-4567",
                "credit_score": 720,
                "monthly_salary": 60000,
                "pre_approved_limit": 350000,
                "existing_loan_amount": 0
            },
            {
                "phone": "9876543216",
                "name": "Rahul Mehta",
                "age": 33,
                "city": "Chennai",
                "email": "rahul.mehta@email.com",
                "pan_number": "JKLMN5678O",
                "aadhaar_number": "7890-1234-5678",
                "credit_score": 680,
                "monthly_salary": 50000,
                "pre_approved_limit": 250000,
                "existing_loan_amount": 75000
            },
            {
                "phone": "9876543217",
                "name": "Deepa Nair",
                "age": 31,
                "city": "Kochi",
                "email": "deepa.nair@email.com",
                "pan_number": "PQRST9012U",
                "aadhaar_number": "8901-2345-6789",
                "credit_score": 790,
                "monthly_salary": 85000,
                "pre_approved_limit": 600000,
                "existing_loan_amount": 0
            },
            {
                "phone": "9876543218",
                "name": "Karthik Iyer",
                "age": 27,
                "city": "Coimbatore",
                "email": "karthik.iyer@email.com",
                "pan_number": "VWXYZ3456A",
                "aadhaar_number": "9012-3456-7890",
                "credit_score": 710,
                "monthly_salary": 58000,
                "pre_approved_limit": 320000,
                "existing_loan_amount": 40000
            },
            {
                "phone": "9876543219",
                "name": "Pooja Verma",
                "age": 34,
                "city": "Jaipur",
                "email": "pooja.verma@email.com",
                "pan_number": "BCDEF7890G",
                "aadhaar_number": "0123-4567-8901",
                "credit_score": 760,
                "monthly_salary": 72000,
                "pre_approved_limit": 480000,
                "existing_loan_amount": 60000
            }
        ]
        
        cursor = self.conn.cursor()
        for customer in dummy_customers:
            cursor.execute('''
                INSERT INTO customers 
                (phone, name, age, city, email, pan_number, aadhaar_number, 
                 credit_score, monthly_salary, pre_approved_limit, 
                 existing_loan_amount, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                customer["phone"], customer["name"], customer["age"],
                customer["city"], customer["email"], customer["pan_number"],
                customer["aadhaar_number"], customer["credit_score"],
                customer["monthly_salary"], customer["pre_approved_limit"],
                customer["existing_loan_amount"], datetime.now().isoformat()
            ))
        
        self.conn.commit()
        print(f"✅ Seeded {len(dummy_customers)} dummy customers successfully!")
    
    def get_customer_by_phone(self, phone):
        """Retrieve customer data by phone number"""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM customers WHERE phone = ?', (phone,))
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def save_loan_application(self, customer_phone, loan_data):
        """Save loan application to database"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO loan_applications 
            (customer_phone, amount, tenure, purpose, interest_rate, emi, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            customer_phone,
            loan_data.get("amount"),
            loan_data.get("tenure"),
            loan_data.get("purpose", "personal"),
            loan_data.get("rate", 0),
            loan_data.get("emi", 0),
            "approved",
            datetime.now().isoformat()
        ))
        self.conn.commit()
    
    def save_document(self, customer_phone, doc_type, doc_path):
        """Save document verification record"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO documents (customer_phone, doc_type, doc_path, verified, verified_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (customer_phone, doc_type, doc_path, True, datetime.now().isoformat()))
        self.conn.commit()
