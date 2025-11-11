from celery import Celery
from celery.schedules import crontab
import redis

# Initialize Celery
celery_app = Celery(
    'smartloan_tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Kolkata',
    enable_utc=True,
)

@celery_app.task(name='send_followup_email')
def send_followup_email(customer_email: str, customer_name: str, loan_status: str):
    """
    Send follow-up email to customer
    """
    # Email sending logic (use SendGrid/AWS SES in production)
    print(f"Sending follow-up email to {customer_email}")
    
    if loan_status == "approved":
        subject = "🎉 Loan Approved! Next Steps"
        body = f"""
        Dear {customer_name},
        
        Congratulations! Your loan has been approved.
        
        Please complete the following steps:
        1. Upload required documents
        2. E-sign the agreement
        3. Receive disbursement in 48-72 hours
        
        Best Regards,
        SmartLoan AI Team
        """
    elif loan_status == "pending":
        subject = "⏳ Your Loan Application Status"
        body = f"""
        Dear {customer_name},
        
        Your loan application is under review.
        
        We may need additional information. Our team will contact you shortly.
        
        Best Regards,
        SmartLoan AI Team
        """
    else:
        subject = "Application Update"
        body = f"""
        Dear {customer_name},
        
        Thank you for your interest in SmartLoan AI.
        
        We'll keep you updated on better loan offers suited to your profile.
        
        Best Regards,
        SmartLoan AI Team
        """
    
    # Simulate email sending
    return {
        "status": "sent",
        "email": customer_email,
        "subject": subject
    }

@celery_app.task(name='send_sms_notification')
def send_sms_notification(phone: str, message: str):
    """
    Send SMS notification to customer
    """
    # SMS sending logic (use Twilio/AWS SNS in production)
    print(f"Sending SMS to {phone}: {message}")
    
    return {
        "status": "sent",
        "phone": phone,
        "message": message
    }

@celery_app.task(name='generate_daily_report')
def generate_daily_report():
    """
    Generate daily analytics report
    """
    from datetime import datetime, timedelta
    
    # Fetch data for last 24 hours
    report = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total_applications": 45,
        "approved": 32,
        "rejected": 8,
        "pending": 5,
        "conversion_rate": 71.1,
        "total_loan_amount": 14500000,
        "avg_loan_amount": 453125
    }
    
    print(f"Daily Report Generated: {report}")
    return report

@celery_app.task(name='update_credit_scores')
def update_credit_scores():
    """
    Periodic task to update credit scores from bureau
    """
    print("Updating credit scores from bureau...")
    # Implementation here
    return {"status": "updated"}

@celery_app.task(name='clean_old_sessions')
def clean_old_sessions():
    """
    Clean up old session data
    """
    from datetime import datetime, timedelta
    
    cutoff_date = datetime.now() - timedelta(days=30)
    print(f"Cleaning sessions older than {cutoff_date}")
    
    # Implementation here
    return {"status": "cleaned"}

# Periodic Tasks Schedule
celery_app.conf.beat_schedule = {
    'generate-daily-report': {
        'task': 'generate_daily_report',
        'schedule': crontab(hour=0, minute=0),  # Every day at midnight
    },
    'update-credit-scores': {
        'task': 'update_credit_scores',
        'schedule': crontab(hour='*/6'),  # Every 6 hours
    },
    'clean-old-sessions': {
        'task': 'clean_old_sessions',
        'schedule': crontab(hour=2, minute=0),  # Every day at 2 AM
    },
}
