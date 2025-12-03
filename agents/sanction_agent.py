import os
from typing import Dict
from datetime import datetime

class SanctionAgent:
    """
    Generates a simple sanction letter (text file) and returns path.
    """

    def __init__(self):
        if not os.path.exists("sanctions"):
            os.makedirs("sanctions")

    def generate_sanction_letter(self, customer_data: Dict, loan_application: Dict) -> str:
        name = customer_data.get("name", "Customer")
        amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 0)
        emi = loan_application.get("emi", 0)
        rate = loan_application.get("rate", 0.0)

        filename = f"sanction_{name}_{int(datetime.utcnow().timestamp())}.txt".replace(" ", "_")
        path = os.path.join("sanctions", filename)

        content = (
            f"Sanction Letter\n\n"
            f"Name: {name}\n"
            f"Loan Amount: ₹{amount}\n"
            f"Tenure (months): {tenure}\n"
            f"EMI: ₹{emi}\n"
            f"Interest rate: {rate}% p.a.\n\n"
            f"This is a system-generated sanction letter.\n"
        )

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        return path
