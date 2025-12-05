import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from datetime import datetime

# agents/sanction_agent.py

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
from datetime import datetime


class SanctionAgent:
    """
    Worker Agent 4: Sanction Letter Generator
    Generates automated PDF sanction letter if all conditions are met.
    """

    def __init__(self):
        self.agent_name = "Sanction Letter Agent"

    def generate_sanction_letter(self, customer_data: dict, loan_data: dict) -> str:
        """
        Generate a PDF sanction letter with customer and loan details.
        
        Args:
            customer_data: Dictionary containing customer information
            loan_data: Dictionary containing loan details
        
        Returns:
            Filename of the generated PDF
        """
        # Create output directory if it doesn't exist
        output_dir = "sanction_letters"
        os.makedirs(output_dir, exist_ok=True)

        # Generate filename
        customer_name = customer_data.get("name", "Customer").replace(" ", "_")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{output_dir}/SanctionLetter_{customer_name}_{timestamp}.pdf"

        # Create PDF
        c = canvas.Canvas(filename, pagesize=letter)
        width, height = letter

        # Header
        c.setFont("Helvetica-Bold", 20)
        c.drawString(100, 750, "TATA CAPITAL")
        c.setFont("Helvetica", 12)
        c.drawString(100, 730, "Personal Loan Sanction Letter")

        # Date
        c.drawString(100, 700, f"Date: {datetime.now().strftime('%d-%B-%Y')}")

        # Customer Details
        c.setFont("Helvetica-Bold", 14)
        c.drawString(100, 670, "Customer Details:")
        c.setFont("Helvetica", 11)
        
        y_position = 650
        c.drawString(120, y_position, f"Name: {customer_data.get('name', 'N/A')}")
        y_position -= 20
        c.drawString(120, y_position, f"Phone: {customer_data.get('phone', 'N/A')}")
        y_position -= 20
        c.drawString(120, y_position, f"Purpose: {customer_data.get('purpose', 'Personal Use')}")

        # Loan Details
        y_position -= 40
        c.setFont("Helvetica-Bold", 14)
        c.drawString(100, y_position, "Loan Sanction Details:")
        c.setFont("Helvetica", 11)

        y_position -= 25
        amount = loan_data.get('amount', 0)
        c.drawString(120, y_position, f"Sanctioned Amount: ₹{amount:,.2f}")

        y_position -= 20
        tenure = loan_data.get('tenure', 0)
        c.drawString(120, y_position, f"Tenure: {tenure} months")

        y_position -= 20
        rate = loan_data.get('rate', loan_data.get('interest_rate', 12.0))  # Fallback to 12% if not found
        c.drawString(120, y_position, f"Interest Rate: {rate}% p.a.")

        y_position -= 20
        emi = loan_data.get('emi', 0)
        c.drawString(120, y_position, f"Monthly EMI: ₹{emi:,.2f}")

        # Calculate totals
        total_payment = emi * tenure
        total_interest = total_payment - amount

        y_position -= 20
        c.drawString(120, y_position, f"Total Payment: ₹{total_payment:,.2f}")

        y_position -= 20
        c.drawString(120, y_position, f"Total Interest: ₹{total_interest:,.2f}")

        # Terms & Conditions
        y_position -= 40
        c.setFont("Helvetica-Bold", 12)
        c.drawString(100, y_position, "Terms & Conditions:")
        c.setFont("Helvetica", 9)

        terms = [
            "1. This sanction is valid for 30 days from the date of issue.",
            "2. Loan disbursement is subject to verification of submitted documents.",
            "3. Interest rate is subject to change based on RBI guidelines.",
            "4. Prepayment is allowed without any penalty charges.",
            "5. EMI payments must be made on or before the 5th of every month.",
            "6. Failure to pay EMI may result in legal action and credit score impact.",
        ]

        y_position -= 20
        for term in terms:
            if y_position < 100:  # Start new page if needed
                c.showPage()
                y_position = 750
                c.setFont("Helvetica", 9)
            
            c.drawString(120, y_position, term)
            y_position -= 15

        # Signature section
        y_position -= 40
        if y_position < 150:
            c.showPage()
            y_position = 700

        c.setFont("Helvetica-Bold", 10)
        c.drawString(100, y_position, "Authorized Signatory")
        c.drawString(400, y_position, "Customer Signature")

        y_position -= 30
        c.line(100, y_position, 250, y_position)
        c.line(400, y_position, 550, y_position)

        # Footer
        c.setFont("Helvetica-Oblique", 8)
        c.drawString(100, 50, "TATA Capital Limited | Registered Office: Mumbai, India")
        c.drawString(100, 35, "Customer Care: 1800-266-6770 | Email: support@tatacapital.com")

        # Save PDF
        c.save()

        return filename


# ==================== TESTING ====================

if __name__ == "__main__":
    agent = SanctionAgent()

    # Test data
    customer_data = {
        "name": "Rajesh Kumar",
        "phone": "9876543210",
        "purpose": "Home Renovation"
    }

    loan_data = {
        "amount": 500000,
        "tenure": 36,
        "rate": 12.5,
        "emi": 16680.50
    }

    print("🔧 Testing Sanction Letter Generator...")
    filename = agent.generate_sanction_letter(customer_data, loan_data)
    print(f"✅ Sanction letter generated: {filename}")
