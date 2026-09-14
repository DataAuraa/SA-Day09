"""
AI HR Assistant & Resume Screener — Configuration Module
Saratha University / Be Practical Training - Phase III GenAI Engineering
"""

import os
from typing import Dict, Any

class Settings:
    PROJECT_NAME: str = "AI HR Assistant & Resume Screener"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # LLM & Generation Configuration
    DEFAULT_PROVIDER: str = os.getenv("LLM_PROVIDER", "deterministic_mock") # 'deterministic_mock', 'openai', 'ollama'
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    
    # Matching Weights
    WEIGHT_REQUIRED_SKILLS: float = 0.65
    WEIGHT_EXPERIENCE: float = 0.25
    WEIGHT_NICE_TO_HAVE: float = 0.10
    
    # Hiring Decision Thresholds
    THRESHOLD_SHORTLIST: float = 75.0
    THRESHOLD_CONSIDER: float = 55.0
    
    # Data Paths
    DATA_DIR: str = os.path.join(os.path.dirname(__file__), "sample_data")
    RESUMES_FILE: str = os.path.join(DATA_DIR, "resumes.json")
    JOBS_FILE: str = os.path.join(DATA_DIR, "jobs.json")

settings = Settings()
