import re
from PyPDF2 import PdfReader
import os

class VerificationAgent:
    """Enhanced KYC verification with proper document extraction"""
    
    def __init__(self, database_service):
        self.agent_name = "Verification Agent"
        self.db = database_service
    
    def extract_text_from_pdf(self, filepath):
        """Extract text from PDF document"""
        try:
            if not os.path.exists(filepath):
                return None, f"File not found: {filepath}"
            
            reader = PdfReader(filepath)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            
            # Clean text
            text = re.sub(r'[^\w\s\-]', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            
            return text, None
        except Exception as e:
            return None, f"Error reading PDF: {str(e)}"
    
    def extract_pan_number(self, text):
        """Extract PAN number using regex pattern [web:16][web:18]"""
        # PAN format: ABCDE1234F (5 letters + 4 digits + 1 letter)
        pattern = r'[A-Z]{5}[0-9]{4}[A-Z]{1}'
        text_upper = text.upper()
        matches = re.findall(pattern, text_upper)
        return matches[0] if matches else None
    
    def extract_aadhaar_number(self, text):
        """Extract Aadhaar number using regex pattern [web:16]"""
        # Aadhaar format: 1234-5678-9012 or 1234 5678 9012
        pattern = r'\d{4}[\s\-]\d{4}[\s\-]\d{4}'
        matches = re.findall(pattern, text)
        if matches:
            # Normalize to hyphen format
            return matches[0].replace(' ', '-')
        
        # Also check for 12 continuous digits
        pattern_continuous = r'\d{12}'
        matches = re.findall(pattern_continuous, text)
        if matches:
            # Format as 1234-5678-9012
            num = matches[0]
            return f"{num[0:4]}-{num[4:8]}-{num[8:12]}"
        
        return None
    
    def verify_documents(self, document_type, filepath, session):
        """Verify PAN or Aadhaar document"""
        customer_phone = session["customer_data"].get("phone")
        
        # Extract text from PDF
        text, error = self.extract_text_from_pdf(filepath)
        if error:
            return f"⚠️ {error}", False
        
        if document_type.lower() == "pan":
            return self._verify_pan(text, filepath, customer_phone, session)
        elif document_type.lower() == "aadhaar":
            return self._verify_aadhaar(text, filepath, customer_phone, session)
        else:
            return "⚠️ Invalid document type. Use 'pan' or 'aadhaar'", False
    
    def _verify_pan(self, text, filepath, customer_phone, session):
        """Verify PAN card"""
        pan_number = self.extract_pan_number(text)
        
        if not pan_number:
            return (
                "⚠️ PAN number not found in document. Please upload a clear PAN card PDF.\n"
                f"Extracted text preview: {text[:200]}..."
            ), False
        
        # Get customer data from database
        customer = self.db.get_customer_by_phone(customer_phone)
        
        if customer and customer["pan_number"]:
            # Verify against database
            if customer["pan_number"].upper() == pan_number.upper():
                session["customer_data"]["pan_verified"] = True
                session["customer_data"]["pan_number"] = pan_number
                self.db.save_document(customer_phone, "PAN", filepath)
                
                return (
                    f"✅ PAN Card Verified Successfully!\n"
                    f"📄 PAN Number: {pan_number}\n"
                    f"👤 Name: {customer['name']}"
                ), True
            else:
                return (
                    f"⚠️ PAN mismatch!\n"
                    f"Expected: {customer['pan_number']}\n"
                    f"Found: {pan_number}"
                ), False
        else:
            # No existing PAN in database, accept extracted one
            session["customer_data"]["pan_verified"] = True
            session["customer_data"]["pan_number"] = pan_number
            self.db.save_document(customer_phone, "PAN", filepath)
            
            return (
                f"✅ PAN Card Verified Successfully!\n"
                f"📄 PAN Number: {pan_number}"
            ), True
    
    def _verify_aadhaar(self, text, filepath, customer_phone, session):
        """Verify Aadhaar card"""
        aadhaar_number = self.extract_aadhaar_number(text)
        
        if not aadhaar_number:
            return (
                "⚠️ Aadhaar number not found in document. Please upload a clear Aadhaar card PDF.\n"
                f"Extracted text preview: {text[:200]}..."
            ), False
        
        # Get customer data from database
        customer = self.db.get_customer_by_phone(customer_phone)
        
        if customer and customer["aadhaar_number"]:
            # Verify against database
            if customer["aadhaar_number"] == aadhaar_number:
                session["customer_data"]["aadhaar_verified"] = True
                session["customer_data"]["aadhaar_number"] = aadhaar_number
                self.db.save_document(customer_phone, "Aadhaar", filepath)
                
                return (
                    f"✅ Aadhaar Card Verified Successfully!\n"
                    f"📄 Aadhaar Number: {aadhaar_number}\n"
                    f"👤 Name: {customer['name']}"
                ), True
            else:
                return (
                    f"⚠️ Aadhaar mismatch!\n"
                    f"Expected: {customer['aadhaar_number']}\n"
                    f"Found: {aadhaar_number}"
                ), False
        else:
            # No existing Aadhaar in database, accept extracted one
            session["customer_data"]["aadhaar_verified"] = True
            session["customer_data"]["aadhaar_number"] = aadhaar_number
            self.db.save_document(customer_phone, "Aadhaar", filepath)
            
            return (
                f"✅ Aadhaar Card Verified Successfully!\n"
                f"📄 Aadhaar Number: {aadhaar_number}"
            ), True
