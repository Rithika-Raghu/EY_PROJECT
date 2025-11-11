import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from datetime import datetime

class SanctionAgent:
    def generate_sanction_letter(self, customer_data, loan_data):
        # Create folder if not exists
        folder = "sanction_letters"
        os.makedirs(folder, exist_ok=True)

        # File path inside folder
        filename = f"sanction_letter_{customer_data['name'].replace(' ', '_')}.pdf"
        file_path = os.path.join(folder, filename)

        c = canvas.Canvas(file_path, pagesize=A4)

        c.drawString(100, 800, "SmartLoan AI - Loan Sanction Letter")
        c.drawString(100, 780, f"Name: {customer_data['name']}")
        c.drawString(100, 760, f"Loan Amount: ₹{loan_data['amount']:,}")
        c.drawString(100, 740, f"Tenure: {loan_data['tenure']} months")
        c.drawString(100, 720, f"Interest Rate: {loan_data['rate']}%")
        c.drawString(100, 700, f"EMI: ₹{loan_data['emi']:,}")
        c.drawString(100, 680, f"Sanction Date: {datetime.now().strftime('%d %B %Y')}")

        c.save()
        return file_path
