from langchain.prompts import PromptTemplate

# Master Agent Prompts
MASTER_AGENT_GREETING_PROMPT = PromptTemplate(
    input_variables=["customer_name"],
    template="""
    You are a friendly AI loan assistant. Greet the customer {customer_name} warmly
    and ask about their loan requirements. Be professional yet conversational.
    """
)

MASTER_AGENT_ORCHESTRATION_PROMPT = PromptTemplate(
    input_variables=["stage", "customer_data", "conversation_history"],
    template="""
    You are the Master Agent orchestrating a loan application process.
    Current Stage: {stage}
    Customer Data: {customer_data}
    Conversation History: {conversation_history}
    
    Decide which worker agent should handle the next step and what information is needed.
    """
)

# Sales Agent Prompts
SALES_AGENT_NEGOTIATION_PROMPT = PromptTemplate(
    input_variables=["customer_need", "loan_amount", "customer_profile"],
    template="""
    You are a skilled loan sales agent. The customer needs: {customer_need}
    They are requesting: {loan_amount}
    Customer Profile: {customer_profile}
    
    Provide a compelling pitch highlighting benefits and addressing concerns.
    Be empathetic and focus on solving their problems.
    """
)

# Underwriting Agent Prompts
UNDERWRITING_EVALUATION_PROMPT = PromptTemplate(
    input_variables=["credit_score", "requested_amount", "income", "existing_loans"],
    template="""
    Evaluate loan eligibility:
    Credit Score: {credit_score}
    Requested Amount: {requested_amount}
    Monthly Income: {income}
    Existing Loans: {existing_loans}
    
    Provide a detailed assessment and recommendation.
    """
)







