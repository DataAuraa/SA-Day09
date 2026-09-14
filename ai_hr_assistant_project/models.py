"""
Data Schemas & Pydantic Models for AI HR Assistant
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CandidateProfile(BaseModel):
    id: str = Field(..., description="Unique candidate ID")
    name: str = Field(..., description="Candidate full name")
    title: str = Field(..., description="Current professional headline")
    education: str = Field(..., description="Degree and university details")
    experience_years: float = Field(..., ge=0.0, description="Total verified years of work experience")
    skills: List[str] = Field(default_factory=list, description="List of technical and domain skills")
    summary: Optional[str] = Field(None, description="Executive bio / profile summary")
    raw_resume: Optional[str] = Field(None, description="Raw unparsed resume text")

class JobDescription(BaseModel):
    id: str = Field(..., description="Unique job requisition ID")
    title: str = Field(..., description="Job role title")
    department: str = Field(..., description="Hiring department")
    min_experience_years: float = Field(0.0, ge=0.0, description="Minimum years of experience required")
    required_skills: List[str] = Field(default_factory=list, description="Mandatory core skill keywords")
    nice_to_have_skills: List[str] = Field(default_factory=list, description="Bonus / preferred skills")
    description: Optional[str] = Field(None, description="Full job requisition text")

class ScreeningRequest(BaseModel):
    candidate: CandidateProfile
    job: JobDescription
    include_ai_rationale: bool = True
    generate_interview_questions: bool = True

class InterviewQuestion(BaseModel):
    topic: str = Field(..., description="Skill or experience area evaluated")
    question: str = Field(..., description="Behavioral or technical question formatted in STAR method")
    expected_answer_guidance: str = Field(..., description="What the interviewer should listen for")

class ScreeningResult(BaseModel):
    candidate_id: str
    candidate_name: str
    job_id: str
    job_title: str
    match_score: float = Field(..., ge=0.0, le=100.0, description="Calculated percentage match score (0-100)")
    decision: str = Field(..., description="'Shortlist for Interview', 'Consider / Secondary Pool', or 'Reject'")
    matched_required_skills: List[str]
    missing_required_skills: List[str]
    matched_nice_to_have_skills: List[str]
    experience_gap_years: float
    executive_summary: str
    ai_rationale: Optional[str] = None
    interview_questions: List[InterviewQuestion] = Field(default_factory=list)
    latency_ms: float = Field(..., description="Inference execution latency in milliseconds")

class BatchScreenRequest(BaseModel):
    candidates: List[CandidateProfile]
    job: JobDescription

class RankedCandidateSummary(BaseModel):
    rank: int
    candidate_id: str
    candidate_name: str
    match_score: float
    decision: str
    matched_skills_count: int
    missing_skills_count: int

class BatchScreenResult(BaseModel):
    job_id: str
    job_title: str
    total_candidates_screened: int
    shortlisted_count: int
    rankings: List[RankedCandidateSummary]
    top_candidate: Optional[RankedCandidateSummary] = None
    latency_ms: float

class HallucinationAuditRequest(BaseModel):
    resume_text: str
    ai_generated_claim: str

class HallucinationAuditResult(BaseModel):
    claim: str
    is_grounded: bool
    verdict: str = Field(..., description="'VERIFIED_FACT' or 'HALLUCINATION_DETECTED'")
    explanation: str
    confidence: float

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
