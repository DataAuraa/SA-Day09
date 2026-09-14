"""
FastAPI Production Microservice — AI HR Assistant & Resume Screener
Day 09 Generative AI & LLM Engineering I — Saratha University
"""

import os
import json
import time
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .models import (
    CandidateProfile,
    JobDescription,
    ScreeningRequest,
    ScreeningResult,
    BatchScreenRequest,
    BatchScreenResult,
    InterviewQuestion,
    HallucinationAuditRequest,
    HallucinationAuditResult,
    HealthResponse
)
from .engine import engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-Throughput Deterministic & Generative AI Talent Screening Microservice",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for Web & Dashboard Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_sample_candidates() -> List[CandidateProfile]:
    if os.path.exists(settings.RESUMES_FILE):
        with open(settings.RESUMES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [CandidateProfile(**item) for item in data]
    return []

def load_sample_jobs() -> List[JobDescription]:
    if os.path.exists(settings.JOBS_FILE):
        with open(settings.JOBS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [JobDescription(**item) for item in data]
    return []

@app.get("/", tags=["General"])
def root_info():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "curriculum": "Day 09 Generative AI & LLM Engineering I",
        "institution": "Saratha University / Be Practical Training",
        "endpoints": {
            "swagger_docs": "/docs",
            "health": "/health",
            "candidates": "/api/v1/candidates",
            "jobs": "/api/v1/jobs",
            "screen_candidate": "POST /api/v1/screen",
            "batch_screen": "POST /api/v1/batch-screen",
            "audit_hallucination": "POST /api/v1/audit-hallucination"
        }
    }

@app.get("/health", response_model=HealthResponse, tags=["General"])
def health_check():
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@app.get("/api/v1/candidates", response_model=List[CandidateProfile], tags=["Data"])
def get_sample_candidates():
    """Returns pre-loaded synthetic engineering candidate resumes."""
    return load_sample_candidates()

@app.get("/api/v1/jobs", response_model=List[JobDescription], tags=["Data"])
def get_sample_jobs():
    """Returns active job description profiles."""
    return load_sample_jobs()

@app.post("/api/v1/screen", response_model=ScreeningResult, tags=["Screening Engine"])
def screen_candidate_endpoint(req: ScreeningRequest):
    """Evaluates a single candidate resume against a job description with deterministic scoring and AI rationale."""
    try:
        result = engine.screen_candidate(req.candidate, req.job, include_rationale=req.include_rationale)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Screening evaluation failed: {str(e)}"
        )

@app.post("/api/v1/batch-screen", response_model=BatchScreenResult, tags=["Screening Engine"])
def batch_screen_endpoint(req: BatchScreenRequest):
    """Evaluates and ranks a cohort of candidate resumes for a given job requisition."""
    if not req.candidates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate cohort cannot be empty."
        )
    return engine.batch_screen(req.candidates, req.job)

@app.post("/api/v1/audit-hallucination", response_model=HallucinationAuditResult, tags=["Responsible AI & Guardrails"])
def audit_hallucination_endpoint(req: HallucinationAuditRequest):
    """Verifies whether an AI-generated claim is corroborated by the candidate's resume."""
    return engine.verify_hallucination(req.resume_text, req.ai_generated_claim)

@app.post("/api/v1/prompt-preview", tags=["Prompt Engineering"])
def preview_few_shot_prompt(candidate: CandidateProfile, job: JobDescription):
    """Generates the enterprise Few-Shot calibration prompt used for LLM inference."""
    prompt_text = engine.build_few_shot_prompt(candidate, job)
    return {
        "candidate_name": candidate.name,
        "job_title": job.title,
        "prompt_length_chars": len(prompt_text),
        "estimated_tokens": len(prompt_text.split()) * 1.3,
        "raw_prompt": prompt_text
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
