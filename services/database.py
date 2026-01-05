import sqlite3
import json
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash


class DatabaseService:
    """Persistent database with users (auth + customer data) and loan management"""
    
    def __init__(self, db_path=None):
        if db_path is None:
            BASE_DIR = os.path.abspath(os.path.dirname(__file__))
            db_path = os.path.join(BASE_DIR, '..', 'loan_system.db')
        
        self.db_path = db_path
        self.conn = None
        self.initialize_database()
    
    def initialize_database(self):
        """Create tables and seed data if database doesn't exist"""
        is_new_db = not os.path.exists(self.db_path)
        
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        cursor = self.conn.cursor()
        
        # ✅ UNIFIED USERS TABLE (handles both auth + customer data)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'customer',
                phone TEXT UNIQUE,
                age INTEGER,
                city TEXT,
                pan_number TEXT,
                aadhaar_number TEXT,
                credit_score INTEGER DEFAULT 750,
                monthly_salary REAL,
                pre_approved_limit REAL DEFAULT 0,
                existing_loan_amount REAL DEFAULT 0,
                created_at TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS loan_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                amount REAL,
                tenure INTEGER,
                purpose TEXT,
                interest_rate REAL,
                emi REAL,
                status TEXT DEFAULT 'pending',
                created_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                doc_type TEXT,
                doc_path TEXT,
                verified BOOLEAN,
                verified_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS otp_verifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                otp_code TEXT NOT NULL,
                created_at TEXT
            )
        ''')
        
        self.conn.commit()
        
        # Seed dummy data only if database is new
        if is_new_db:
            self._seed_dummy_users()
            print("✅ Database initialized with admin + 10 dummy customers!")
        else:
            print("✅ Connected to existing database!")
    
    def _seed_dummy_users(self):
        """Seed admin + 10 dummy customer users"""
        cursor = self.conn.cursor()
        
        # Create admin
        cursor.execute('''
            INSERT INTO users 
            (username, email, password, role, phone, city, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            'admin',
            'admin@tatacapital.com',
            generate_password_hash('admin123'),
            'admin',
            '9999999999',
            'Mumbai',
            datetime.now().isoformat()
        ))
        
        # Create 10 dummy customers
        dummy_customers = [
            {
                "username": "rajesh.kumar",
                "email": "rajesh.kumar@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543210",
                "age": 32,
                "city": "Mumbai",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "1234-5678-9012",
                "credit_score": 780,
                "monthly_salary": 75000,
                "pre_approved_limit": 500000,
                "existing_loan_amount": 0
            },
            {
                "username": "priya.sharma",
                "email": "priya.sharma@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543211",
                "age": 28,
                "city": "Delhi",
                "pan_number": "FGHIJ5678K",
                "aadhaar_number": "2345-6789-0123",
                "credit_score": 820,
                "monthly_salary": 95000,
                "pre_approved_limit": 700000,
                "existing_loan_amount": 100000
            },
            {
                "username": "amit.patel",
                "email": "amit.patel@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543212",
                "age": 35,
                "city": "Ahmedabad",
                "pan_number": "KLMNO9012P",
                "aadhaar_number": "3456-7890-1234",
                "credit_score": 750,
                "monthly_salary": 65000,
                "pre_approved_limit": 400000,
                "existing_loan_amount": 50000
            },
            {
                "username": "sneha.reddy",
                "email": "sneha.reddy@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543213",
                "age": 29,
                "city": "Hyderabad",
                "pan_number": "QRSTU3456V",
                "aadhaar_number": "4567-8901-2345",
                "credit_score": 690,
                "monthly_salary": 55000,
                "pre_approved_limit": 300000,
                "existing_loan_amount": 0
            },
            {
                "username": "vikram.singh",
                "email": "vikram.singh@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543214",
                "age": 40,
                "city": "Bangalore",
                "pan_number": "WXYZB7890C",
                "aadhaar_number": "5678-9012-3456",
                "credit_score": 850,
                "monthly_salary": 120000,
                "pre_approved_limit": 1000000,
                "existing_loan_amount": 200000
            },
            {
                "username": "anita.desai",
                "email": "anita.desai@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543215",
                "age": 26,
                "city": "Pune",
                "pan_number": "DEFGH1234I",
                "aadhaar_number": "6789-0123-4567",
                "credit_score": 720,
                "monthly_salary": 60000,
                "pre_approved_limit": 350000,
                "existing_loan_amount": 0
            },
            {
                "username": "rahul.mehta",
                "email": "rahul.mehta@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543216",
                "age": 33,
                "city": "Chennai",
                "pan_number": "JKLMN5678O",
                "aadhaar_number": "7890-1234-5678",
                "credit_score": 680,
                "monthly_salary": 50000,
                "pre_approved_limit": 250000,
                "existing_loan_amount": 75000
            },
            {
                "username": "deepa.nair",
                "email": "deepa.nair@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543217",
                "age": 31,
                "city": "Kochi",
                "pan_number": "PQRST9012U",
                "aadhaar_number": "8901-2345-6789",
                "credit_score": 790,
                "monthly_salary": 85000,
                "pre_approved_limit": 600000,
                "existing_loan_amount": 0
            },
            {
                "username": "karthik.iyer",
                "email": "karthik.iyer@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543218",
                "age": 27,
                "city": "Coimbatore",
                "pan_number": "VWXYZ3456A",
                "aadhaar_number": "9012-3456-7890",
                "credit_score": 710,
                "monthly_salary": 58000,
                "pre_approved_limit": 320000,
                "existing_loan_amount": 40000
            },
            {
                "username": "pooja.verma",
                "email": "pooja.verma@email.com",
                "password": generate_password_hash("password123"),
                "role": "customer",
                "phone": "9876543219",
                "age": 34,
                "city": "Jaipur",
                "pan_number": "BCDEF7890G",
                "aadhaar_number": "0123-4567-8901",
                "credit_score": 760,
                "monthly_salary": 72000,
                "pre_approved_limit": 480000,
                "existing_loan_amount": 60000
            }
        ]
        
        for customer in dummy_customers:
            cursor.execute('''
                INSERT INTO users 
                (username, email, password, role, phone, age, city, pan_number, 
                 aadhaar_number, credit_score, monthly_salary, pre_approved_limit, 
                 existing_loan_amount, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                customer["username"], customer["email"], customer["password"],
                customer["role"], customer["phone"], customer["age"],
                customer["city"], customer["pan_number"], customer["aadhaar_number"],
                customer["credit_score"], customer["monthly_salary"],
                customer["pre_approved_limit"], customer["existing_loan_amount"],
                datetime.now().isoformat()
            ))
        
        self.conn.commit()
        print(f"✅ Seeded admin + {len(dummy_customers)} dummy customers!")
    
    # ==================== AUTH METHODS ====================
    
    def create_user(self, username, email, password, phone=None):
        """Create new user account"""
        cursor = self.conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO users (username, email, password, role, phone, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                username,
                email,
                generate_password_hash(password),
                'customer',
                phone,
                datetime.now().isoformat()
            ))
            self.conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError as e:
            return None
    
    def get_user_by_email(self, email):
        """Get user by email (for login)"""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def get_otp_verification(self, email):
        """Retrieve OTP verification record by email"""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM otp_verifications WHERE email = ?', (email,))
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def create_otp_verification(self, email, otp_code):
        """Create or update OTP verification record"""
        cursor = self.conn.cursor()
        existing = self.get_otp_verification(email)
        if existing:
            cursor.execute('''
                UPDATE otp_verifications
                SET otp_code = ?, created_at = ?
                WHERE email = ?
            ''', (otp_code, datetime.now().isoformat(), email))
        else:
            cursor.execute('''
                INSERT INTO otp_verifications (email, otp_code, created_at)
                VALUES (?, ?, ?)
            ''', (email, otp_code, datetime.now().isoformat()))
        self.conn.commit()
    
    def verify_password(self, stored_password, provided_password):
        """Verify password hash"""
        return check_password_hash(stored_password, provided_password)
    
    # ==================== CUSTOMER METHODS ====================
    
    def get_customer_by_phone(self, phone):
        """Retrieve customer data by phone number"""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM users WHERE phone = ? AND role = "customer"', (phone,))
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def get_all_customers(self):
        """Get all customers with their loan data"""
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM users WHERE role = "customer"')
        customers = [dict(row) for row in cursor.fetchall()]
        
        # Add loan data for each customer
        for customer in customers:
            cursor.execute('''
                SELECT * FROM loan_applications WHERE user_id = ?
            ''', (customer['id'],))
            customer['loans'] = [dict(row) for row in cursor.fetchall()]
        
        return customers
    
    def save_loan_application(self, user_id, loan_data):
        """Save loan application to database"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO loan_applications 
            (user_id, amount, tenure, purpose, interest_rate, emi, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            loan_data.get("amount"),
            loan_data.get("tenure"),
            loan_data.get("purpose", "personal"),
            loan_data.get("rate", 0),
            loan_data.get("emi", 0),
            "approved",
            datetime.now().isoformat()
        ))
        self.conn.commit()
        return cursor.lastrowid
    
    def save_document(self, user_id, doc_type, doc_path):
        """Save document verification record"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO documents (user_id, doc_type, doc_path, verified, verified_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, doc_type, doc_path, True, datetime.now().isoformat()))
        self.conn.commit()
