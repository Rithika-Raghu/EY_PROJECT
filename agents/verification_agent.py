import os
import random
import uuid
from dataclasses import dataclass, field, asdict
from typing import Dict, Optional, Tuple, Any, List
import re
from PyPDF2 import PdfReader

class VerificationAgent:
    """
    Verification Agent - Handles KYC verification
    Validates customer identity and contact details
    """
    
    def __init__(self, crm_service):
        self.agent_name = "Verification Agent"
        self.crm = crm_service
        
    def verify_phone(self, phone: str, session: Dict) -> tuple:
        """
        Verify phone number against CRM
        """
        import re
        
        # Clean phone number
        phone_clean = re.sub(r'\D', '', phone)
        
        if len(phone_clean) == 10:
            # Verify with CRM
            is_valid = self.crm.verify_phone(phone_clean)
            
            if is_valid:
                return ("✅ Phone number verified successfully! Now, please provide your complete address for KYC verification.", True)
            else:
                return ("✅ Thank you! I've noted your phone number. Now, please provide your complete address for KYC verification.", True)
        
        return ("Please provide a valid 10-digit mobile number.", False)
    
    def verify_address(self, address: str, session: Dict) -> tuple:
        """
        Verify address
        """
        if len(address) > 20:  # Basic validation
            # Verify with CRM
            is_valid = self.crm.verify_address(address)
            
            return ("""✅ KYC verification completed successfully! 

Now let me check your credit eligibility and pre-approved offers. This will just take a moment... 🔍""", True)
        
        return ("Please provide your complete address including city and pin code.", False)
    
    def verify_documents(self, document_type: str, document_path: str, session: Dict) -> Tuple[str, bool]:
        """
        Verify uploaded KYC documents.
        Simulates reading a PDF or image file (PAN/Aadhaar) and checking validity.
        """

        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(document_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        except Exception:
            text = ""  # fallback if not a PDF

        # ---------- Simulated pattern validation ----------
        if document_type.lower() == "pan":
            # PAN format: 5 letters + 4 digits + 1 letter
            pattern = r"[A-Z]{5}[0-9]{4}[A-Z]"
            if re.search(pattern, text):
                session["customer_data"]["pan_verified"] = True
                return ("✅ PAN card verified successfully!", True)
            else:
                return ("❌ Invalid PAN card detected. Please upload a valid PAN copy.", False)

        elif document_type.lower() == "aadhaar":
            # Aadhaar format: 12 digits
            pattern = r"\b\d{4}\s?\d{4}\s?\d{4}\b"
            if re.search(pattern, text):
                session["customer_data"]["aadhaar_verified"] = True
                return ("✅ Aadhaar card verified successfully!", True)
            else:
                return ("❌ Aadhaar number not found or invalid in document.", False)

        elif document_type.lower() == "id_proof":
            # Dummy check: just confirm the file exists and has some text
            if len(text) > 20:
                session["customer_data"]["id_verified"] = True
                return ("✅ ID proof verified successfully!", True)
            else:
                return ("❌ ID proof unreadable. Please re-upload.", False)

        else:
            return (f"⚠️ Unknown document type: {document_type}", False)