from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """
    Application configuration settings
    """
    
    # Application
    APP_NAME: str = "SmartLoan AI"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # API Configuration
    API_V1_PREFIX: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./smartloan.db"
    CHROMA_DB_PATH: str = "./chroma_db"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_URL: str = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
    
    # Celery
    CELERY_BROKER_URL: str = REDIS_URL
    CELERY_RESULT_BACKEND: str = REDIS_URL
    
    # HuggingFace
    HUGGINGFACE_API_TOKEN: Optional[str] = None
    
    # AI Model Configuration
    SENTIMENT_MODEL: str = "distilbert-base-uncased-finetuned-sst-2-english"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL: str = "google/flan-t5-large"
    
    # Loan Configuration
    MIN_CREDIT_SCORE: int = 700
    MAX_EMI_RATIO: float = 0.50  # 50% of salary
    DEFAULT_INTEREST_RATE: float = 10.5
    PROCESSING_FEE_PERCENTAGE: float = 2.0
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    SANCTION_LETTER_DIR: str = "./sanction_letters"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    # Email Configuration (Optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # SMS Configuration (Optional)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
