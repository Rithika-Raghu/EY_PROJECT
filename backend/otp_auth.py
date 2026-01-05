import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Generate 6-digit OTP
def generate_otp():
    return random.randint(100000, 999999)

def send_otp_email(receiver_email):
    sender_email = os.getenv("SMTP_HOST_EMAIL")
    app_password = os.getenv("SMTP_HOST_PASSWORD")
    app_password = ' '.join(app_password.split('_'))
    print(f"Using sender email: {sender_email}")
    print(f"Using app password: {app_password}")

    otp = generate_otp()

    # Email content
    subject = "Your OTP Verification Code"
    body = f"""
    Dear User,

    Your OTP for verification is: {otp}

    This OTP is valid for 5 minutes.
    Please do not share it with anyone.

    Regards,
    Security Team
    """

    # Email setup
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        # SMTP connection
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()

        print(f"OTP sent successfully to {receiver_email}")
        return otp

    except Exception as e:
        print("Failed to send OTP:", e)
        return None