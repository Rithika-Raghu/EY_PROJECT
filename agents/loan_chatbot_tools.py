# loan_chatbot_tools.py

from typing import Dict
import math


def calc_emi(amount: float, annual_rate: float, tenure_months: int) -> Dict:
    """
    Calculate EMI (Equated Monthly Installment) for a loan.
    
    Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    where:
        P = Principal loan amount
        R = Monthly interest rate (annual rate / 12 / 100)
        N = Tenure in months
    
    Args:
        amount: Principal loan amount in ₹
        annual_rate: Annual interest rate in percentage (e.g., 12 for 12%)
        tenure_months: Loan tenure in months
    
    Returns:
        Dict with EMI details
    """
    try:
        r = annual_rate / 12 / 100  # Monthly interest rate
        n = tenure_months

        if r == 0:
            emi = amount / n
        else:
            emi = amount * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)

        total_payment = emi * n
        total_interest = total_payment - amount

        return {
            "status": "success",
            "emi": round(emi, 2),
            "amount": amount,
            "annual_rate": annual_rate,
            "tenure_months": tenure_months,
            "total_payment": round(total_payment, 2),
            "total_interest": round(total_interest, 2),
            "message": f"Monthly EMI: ₹{round(emi, 2)} for {tenure_months} months"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error calculating EMI: {str(e)}"
        }


def check_eligibility(
    amount: float, 
    monthly_income: float, 
    credit_score: int = 750,
    tenure_months: int = 36
) -> Dict:
    """
    Check loan eligibility based on EMI to income ratio.
    
    NBFC Rule: EMI should not exceed 50% of monthly salary
    
    Args:
        amount: Requested loan amount in ₹
        monthly_income: Monthly income/salary in ₹
        credit_score: Credit score (out of 900)
        tenure_months: Desired tenure in months
    
    Returns:
        Dict with eligibility status
    """
    try:
        # Standard personal loan rate assumption
        annual_rate = 14.0
        
        # Calculate EMI
        r = annual_rate / 12 / 100
        n = tenure_months
        emi = amount * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)
        
        # Calculate EMI to income ratio
        emi_ratio = (emi / monthly_income) * 100 if monthly_income > 0 else 100
        
        # Eligibility checks
        if credit_score < 700:
            status = "rejected"
            message = "❌ Credit score below minimum threshold (700)"
        elif emi_ratio <= 50:
            status = "eligible"
            message = f"✅ Eligible! EMI is {round(emi_ratio, 1)}% of income (within 50% limit)"
        elif emi_ratio <= 60:
            status = "borderline"
            message = f"⚠️ Borderline eligibility. EMI is {round(emi_ratio, 1)}% of income. Consider lower amount."
        else:
            status = "not_eligible"
            message = f"❌ Not eligible. EMI is {round(emi_ratio, 1)}% of income (exceeds 50% limit)"
        
        return {
            "status": status,
            "emi": round(emi, 2),
            "monthly_income": monthly_income,
            "emi_to_income_ratio": round(emi_ratio, 1),
            "credit_score": credit_score,
            "message": message
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error checking eligibility: {str(e)}"
        }


def underwrite(
    amount: float, 
    pre_approved_limit: float, 
    credit_score: int,
    monthly_salary: float = None
) -> Dict:
    """
    Underwriting logic for NBFC personal loan.
    
    Business Rules:
    1. Reject if credit_score < 700
    2. If amount <= pre_approved_limit: approve instantly
    3. If amount <= 2× pre_approved_limit: request salary slip
       - Approve only if EMI ≤ 50% of salary
    4. Reject if amount > 2× pre_approved_limit
    
    Args:
        amount: Requested loan amount in ₹
        pre_approved_limit: Customer's pre-approved limit from CRM
        credit_score: Credit score (out of 900)
        monthly_salary: Monthly salary (optional, for document cases)
    
    Returns:
        Dict with underwriting decision
    """
    try:
        # Rule 1: Credit score check
        if credit_score < 700:
            return {
                "status": "rejected",
                "reason": "Credit score below minimum threshold (700)",
                "credit_score": credit_score,
                "message": f"❌ Application rejected. Credit score {credit_score}/900 is below minimum requirement."
            }
        
        # Rule 2: Within pre-approved limit
        if amount <= pre_approved_limit:
            return {
                "status": "approved",
                "reason": "Within pre-approved limit",
                "approved_amount": amount,
                "message": f"✅ Instantly approved! Amount is within your pre-approved limit of ₹{pre_approved_limit:,.0f}"
            }
        
        # Rule 3: Between 1x and 2x pre-approved limit
        elif amount <= 2 * pre_approved_limit:
            if monthly_salary is None:
                return {
                    "status": "requires_documents",
                    "reason": "Above pre-approved limit; needs income proof",
                    "required_documents": ["salary_slip"],
                    "message": (
                        f"⚠️ Requested amount ₹{amount:,.0f} exceeds pre-approved limit ₹{pre_approved_limit:,.0f}.\n"
                        "We need your salary slip to proceed."
                    )
                }
            else:
                # Check EMI vs 50% of salary rule
                annual_rate = 14.0  # Standard rate
                tenure_months = 36  # Standard tenure
                
                r = annual_rate / 12 / 100
                n = tenure_months
                emi = amount * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)
                
                max_allowed_emi = monthly_salary * 0.50
                
                if emi <= max_allowed_emi:
                    return {
                        "status": "approved",
                        "reason": "EMI within 50% of salary",
                        "approved_amount": amount,
                        "emi": round(emi, 2),
                        "salary": monthly_salary,
                        "message": f"✅ Approved! EMI ₹{round(emi, 2)} is within 50% of your salary ₹{monthly_salary:,.0f}"
                    }
                else:
                    return {
                        "status": "rejected",
                        "reason": "EMI exceeds 50% of salary",
                        "emi": round(emi, 2),
                        "max_allowed_emi": round(max_allowed_emi, 2),
                        "message": (
                            f"❌ Application rejected. EMI ₹{round(emi, 2)} exceeds 50% of salary.\n"
                            f"Maximum allowed EMI: ₹{round(max_allowed_emi, 2)}"
                        )
                    }
        
        # Rule 4: Above 2x pre-approved limit
        else:
            return {
                "status": "rejected",
                "reason": "Requested amount exceeds 2× pre-approved limit",
                "max_allowed": 2 * pre_approved_limit,
                "message": (
                    f"❌ Application rejected. Requested amount ₹{amount:,.0f} exceeds "
                    f"maximum allowed ₹{2 * pre_approved_limit:,.0f} (2× pre-approved limit)."
                )
            }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error in underwriting: {str(e)}"
        }


def generate_sanction_letter(
    customer_name: str,
    phone: str,
    amount: float,
    tenure_months: int,
    annual_rate: float,
    emi: float,
    purpose: str = "Personal Use"
) -> Dict:
    """
    Generate sanction letter data structure.
    
    Note: This returns structured data. The actual PDF generation
    is handled by SanctionAgent.generate_sanction_letter()
    
    Args:
        customer_name: Customer's full name
        phone: Customer's phone number
        amount: Sanctioned loan amount in ₹
        tenure_months: Loan tenure in months
        annual_rate: Annual interest rate in %
        emi: Monthly EMI in ₹
        purpose: Loan purpose
    
    Returns:
        Dict with sanction letter details
    """
    try:
        import datetime
        
        sanction_date = datetime.datetime.now().strftime("%d-%b-%Y")
        
        total_payment = emi * tenure_months
        total_interest = total_payment - amount
        
        return {
            "status": "ready",
            "customer_name": customer_name,
            "phone": phone,
            "sanction_date": sanction_date,
            "loan_details": {
                "amount": amount,
                "tenure_months": tenure_months,
                "annual_rate": annual_rate,
                "emi": emi,
                "purpose": purpose,
                "total_payment": round(total_payment, 2),
                "total_interest": round(total_interest, 2)
            },
            "message": f"✅ Sanction letter data prepared for {customer_name}",
            "summary": (
                f"Loan Amount: ₹{amount:,.0f} | "
                f"Tenure: {tenure_months} months | "
                f"Rate: {annual_rate}% p.a. | "
                f"EMI: ₹{emi:,.2f}"
            )
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating sanction letter data: {str(e)}"
        }


# ==================== TESTING FUNCTIONS ====================

if __name__ == "__main__":
    print("=" * 60)
    print("LOAN CHATBOT TOOLS - TEST SUITE")
    print("=" * 60)
    
    # # Test 1: EMI Calculator
    # print("\n1️⃣ Testing calc_emi()")
    # print("-" * 60)
    # result = calc_emi(amount=500000, annual_rate=12, tenure_months=36)
    # print(f"Amount: ₹5,00,000 | Rate: 12% | Tenure: 36 months")
    # print(f"Result: {result['message']}")
    # print(f"Total Interest: ₹{result['total_interest']:,.2f}")
    
    # # Test 2: Eligibility Check
    # print("\n2️⃣ Testing check_eligibility()")
    # print("-" * 60)
    # result = check_eligibility(
    #     amount=500000, 
    #     monthly_income=60000, 
    #     credit_score=750,
    #     tenure_months=36
    # )
    # print(f"Loan: ₹5,00,000 | Income: ₹60,000 | Credit: 750")
    # print(f"Result: {result['message']}")
    
    # # Test 3: Underwriting - Instant Approval
    # print("\n3️⃣ Testing underwrite() - Instant Approval")
    # print("-" * 60)
    # result = underwrite(
    #     amount=300000,
    #     pre_approved_limit=500000,
    #     credit_score=780
    # )
    # print(f"Amount: ₹3,00,000 | Pre-approved: ₹5,00,000 | Credit: 780")
    # print(f"Result: {result['message']}")
    
    # # Test 4: Underwriting - Requires Documents
    # print("\n4️⃣ Testing underwrite() - Requires Documents")
    # print("-" * 60)
    # result = underwrite(
    #     amount=700000,
    #     pre_approved_limit=500000,
    #     credit_score=780
    # )
    # print(f"Amount: ₹7,00,000 | Pre-approved: ₹5,00,000 | Credit: 780")
    # print(f"Result: {result['message']}")
    
    # # Test 5: Underwriting - With Salary
    # print("\n5️⃣ Testing underwrite() - With Salary Verification")
    # print("-" * 60)
    # result = underwrite(
    #     amount=700000,
    #     pre_approved_limit=500000,
    #     credit_score=780,
    #     monthly_salary=80000
    # )
    # print(f"Amount: ₹7,00,000 | Pre-approved: ₹5,00,000 | Salary: ₹80,000")
    # print(f"Result: {result['message']}")
    
    # # Test 6: Sanction Letter Data
    # print("\n6️⃣ Testing generate_sanction_letter()")
    # print("-" * 60)
    # result = generate_sanction_letter(
    #     customer_name="Rajesh Kumar",
    #     phone="9876543210",
    #     amount=500000,
    #     tenure_months=36,
    #     annual_rate=12.5,
    #     emi=16680.00,
    #     purpose="Home Renovation"
    # )
    # print(f"Customer: {result['customer_name']}")
    # print(f"Result: {result['message']}")
    # print(f"Summary: {result['summary']}")
    
    # print("\n" + "=" * 60)
    # print("ALL TESTS COMPLETED ✅")
    # print("=" * 60)
