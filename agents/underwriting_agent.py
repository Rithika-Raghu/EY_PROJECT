# 
class UnderwritingAgent:
    """
    Underwriting Agent
    - Fetches credit score from Credit Bureau API
    - Checks pre-approved limit from Offer Mart
    - Evaluates eligibility based on loan amount
    """

    def __init__(self, credit_bureau, offer_mart):
        self.agent_name = "Underwriting Agent"
        self.credit_bureau = credit_bureau
        self.offer_mart = offer_mart

    def calc_emi(self, principal, rate, tenure):
        """Calculate EMI using formula"""
        monthly_rate = rate / (12 * 100)
        emi = principal * monthly_rate * ((1 + monthly_rate) ** tenure) / (((1 + monthly_rate) ** tenure) - 1)
        return round(emi, 2)

    def evaluate_application(self, customer_data, loan_application):
        """
        Main evaluation logic - checks credit score and pre-approved limit
        """
        phone = customer_data.get("phone")
        requested_amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 36)

        # ✅ FIX: Use fetch_credit_score instead of get_credit_score
        credit_info = self.credit_bureau.fetch_credit_score(phone)
        credit_score = credit_info.get("credit_score", 0)

        print(f"\n📊 Underwriting Evaluation:")
        print(f"   Phone: {phone}")
        print(f"   Credit Score: {credit_score}/900")
        print(f"   Requested Amount: ₹{requested_amount:,}")
        print(f"   Tenure: {tenure} months")

        # Check credit score eligibility
        if credit_score < 700:
            return {
                "status": "rejected",
                "message": (
                    f"❌ Loan application rejected.\n"
                    f"Credit Score: {credit_score}/900 (Minimum required: 700)\n"
                    f"💡 Tip: Improve your credit score by paying bills on time."
                )
            }

        # Get pre-approved offers
        offers = self.offer_mart.get_preapproved_offers(phone)
        pre_approved_limit = offers.get("pre_approved_limit", 0)
        interest_rate = offers.get("interest_rate", 12.5)

        print(f"   Pre-approved Limit: ₹{pre_approved_limit:,}")
        print(f"   Interest Rate: {interest_rate}%")

        # Case 1: Within pre-approved limit - Instant approval
        if requested_amount <= pre_approved_limit:
            emi = self.calc_emi(requested_amount, interest_rate, tenure)
            
            print(f"   ✅ Status: INSTANT APPROVAL")
            print(f"   EMI: ₹{emi:,}")
            
            return {
                "status": "approved",
                "rate": interest_rate,
                "emi": emi,
                "message": (
                    f"🎉 Loan Approved!\n\n"
                    f"💰 Amount: ₹{requested_amount:,}\n"
                    f"📅 Tenure: {tenure} months\n"
                    f"📊 Interest Rate: {interest_rate}% p.a.\n"
                    f"💳 EMI: ₹{emi:,}/month\n"
                    f"⭐ Credit Score: {credit_score}/900\n\n"
                    f"✅ Your loan is within pre-approved limit!"
                )
            }

        # Case 2: Up to 2x pre-approved limit - Requires salary verification
        elif requested_amount <= (pre_approved_limit * 2):
            print(f"   📄 Status: REQUIRES SALARY VERIFICATION")
            
            return {
                "status": "requires_documents",
                "rate": interest_rate,
                "message": (
                    f"📋 Additional verification required.\n\n"
                    f"💰 Requested: ₹{requested_amount:,}\n"
                    f"📊 Pre-approved: ₹{pre_approved_limit:,}\n"
                    f"⭐ Credit Score: {credit_score}/900\n\n"
                    f"Your requested amount exceeds pre-approved limit.\n"
                    f"Please upload your salary slip for verification."
                )
            }

        # Case 3: More than 2x pre-approved limit - Rejected
        else:
            print(f"   ❌ Status: REJECTED (Exceeds 2x limit)")
            
            return {
                "status": "rejected",
                "message": (
                    f"❌ Loan amount too high.\n\n"
                    f"💰 Requested: ₹{requested_amount:,}\n"
                    f"📊 Pre-approved: ₹{pre_approved_limit:,}\n"
                    f"📈 Maximum eligible: ₹{pre_approved_limit * 2:,}\n\n"
                    f"💡 Tip: Try requesting ₹{pre_approved_limit:,} or less for instant approval."
                )
            }

    def evaluate_with_salary(self, customer_data, loan_application, monthly_salary):
        """
        Re-evaluate application with salary information
        EMI should not exceed 50% of monthly salary
        """
        phone = customer_data.get("phone")
        requested_amount = loan_application.get("amount", 0)
        tenure = loan_application.get("tenure", 36)

        # ✅ FIX: Use fetch_credit_score instead of get_credit_score
        credit_info = self.credit_bureau.fetch_credit_score(phone)
        credit_score = credit_info.get("credit_score", 0)

        # Get interest rate
        offers = self.offer_mart.get_preapproved_offers(phone)
        interest_rate = offers.get("interest_rate", 12.5)

        # Calculate EMI
        emi = self.calc_emi(requested_amount, interest_rate, tenure)

        print(f"\n📊 Salary Verification:")
        print(f"   Monthly Salary: ₹{monthly_salary:,}")
        print(f"   Calculated EMI: ₹{emi:,}")
        print(f"   EMI/Salary Ratio: {(emi/monthly_salary)*100:.1f}%")

        # Check if EMI is within 50% of salary
        max_allowed_emi = monthly_salary * 0.50

        if emi <= max_allowed_emi:
            print(f"   ✅ Status: APPROVED (EMI within limits)")
            
            return {
                "status": "approved",
                "rate": interest_rate,
                "emi": emi,
                "message": (
                    f"🎉 Loan Approved!\n\n"
                    f"💰 Amount: ₹{requested_amount:,}\n"
                    f"📅 Tenure: {tenure} months\n"
                    f"📊 Interest Rate: {interest_rate}% p.a.\n"
                    f"💳 EMI: ₹{emi:,}/month\n"
                    f"💵 Monthly Salary: ₹{monthly_salary:,}\n"
                    f"📈 EMI/Salary: {(emi/monthly_salary)*100:.1f}%\n"
                    f"⭐ Credit Score: {credit_score}/900\n\n"
                    f"✅ Your EMI is within affordable limits!"
                )
            }
        else:
            print(f"   ❌ Status: REJECTED (EMI too high)")
            
            # Calculate maximum affordable loan
            max_emi = monthly_salary * 0.50
            monthly_rate = interest_rate / (12 * 100)
            max_loan = max_emi * (((1 + monthly_rate) ** tenure) - 1) / (monthly_rate * ((1 + monthly_rate) ** tenure))
            
            return {
                "status": "rejected",
                "message": (
                    f"❌ Loan rejected - EMI too high.\n\n"
                    f"💰 Requested: ₹{requested_amount:,}\n"
                    f"💳 EMI would be: ₹{emi:,}/month\n"
                    f"💵 Monthly Salary: ₹{monthly_salary:,}\n"
                    f"📉 EMI/Salary: {(emi/monthly_salary)*100:.1f}% (Max allowed: 50%)\n\n"
                    f"💡 Maximum affordable loan: ₹{int(max_loan):,}\n"
                    f"   (EMI: ₹{int(max_emi):,}/month)"
                )
            }
