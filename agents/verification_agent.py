import os
from typing import Dict, Tuple

class VerificationAgent:
    """
    Dummy KYC verification:
    - checks file exists
    - does simple filename-based heuristics for demo
    """

    def __init__(self, crm_service=None):
        self.crm = crm_service

    def reset(self):
        return

    def verify_documents(self, document_type: str, filepath: str, session: Dict) -> Tuple[str, bool]:
        """
        Verify document by filepath.
        Returns (message, ok)
        For demo: if file exists -> accept and mark in session
        """
        if not os.path.exists(filepath):
            return f"⚠️ File not found: {filepath}. Please re-upload your {document_type.upper()} PDF.", False

        # Very simple heuristic: accept if file present
        key = f"{document_type}_verified"
        session.setdefault("customer_data", {})
        session["customer_data"][key] = True

        return f"✅ {document_type.upper()} verified successfully.", True
