"""
Unit & Integration Test Suite for AI HR Assistant Screening Engine
Run via:
    pytest tests/test_screening_engine.py
"""

import pytest
from ai_hr_assistant_project.engine import ScreeningEngine, normalize_skill
from ai_hr_assistant_project.models import CandidateProfile, JobDescription

@pytest.fixture
def engine():
    return ScreeningEngine()

@pytest.fixture
def sample_candidate():
    return CandidateProfile(
        id="cand_test",
        name="Test Candidate",
        title="Software Engineer",
        education="B.Tech Computer Science",
        experience_years=3.0,
        skills=["Python", "SQL", "Pandas", "Docker"],
        summary="Experienced engineer with Python and Docker background."
    )

@pytest.fixture
def sample_job():
    return JobDescription(
        id="job_test",
        title="Data Engineer",
        department="Engineering",
        min_experience_years=2.0,
        required_skills=["Python", "SQL", "Docker"],
        nice_to_have_skills=["Kubernetes", "AWS"],
        description="Looking for Data Engineer with Python & Docker experience."
    )

def test_normalize_skill():
    assert normalize_skill("ML") == "machine learning"
    assert normalize_skill("k8s") == "kubernetes"
    assert normalize_skill("ReactJS") == "react"
    assert normalize_skill("Python") == "python"

def test_skill_overlap_computation(engine, sample_candidate, sample_job):
    matched, missing, ratio = engine.compute_skill_overlap(
        sample_candidate.skills,
        sample_job.required_skills
    )
    assert "Python" in matched
    assert "SQL" in matched
    assert "Docker" in matched
    assert len(missing) == 0
    assert ratio == 1.0

def test_screening_score_and_decision(engine, sample_candidate, sample_job):
    res = engine.screen_candidate(sample_candidate, sample_job)
    assert res.candidate_id == "cand_test"
    assert res.job_id == "job_test"
    assert res.match_score >= 80.0
    assert res.decision == "Shortlist for Interview"
    assert len(res.missing_required_skills) == 0
    assert len(res.interview_questions) >= 2

def test_experience_penalty_on_junior_candidate(engine, sample_job):
    junior_candidate = CandidateProfile(
        id="cand_jr",
        name="Junior Dev",
        title="Junior Analyst",
        education="B.Sc",
        experience_years=0.5, # 1.5 years below required 2.0
        skills=["Python", "SQL", "Docker"]
    )
    res = engine.screen_candidate(junior_candidate, sample_job)
    assert res.experience_gap_years == -1.5
    # Experience penalty should lower score compared to senior candidate
    assert res.match_score < 85.0

def test_batch_ranking_order(engine, sample_job):
    c1 = CandidateProfile(id="c1", name="Strong Match", title="Dev", education="B.Tech", experience_years=3.0, skills=["Python", "SQL", "Docker"])
    c2 = CandidateProfile(id="c2", name="Weak Match", title="Intern", education="B.Tech", experience_years=0.0, skills=["HTML"])
    
    batch = engine.batch_screen([c2, c1], sample_job)
    assert batch.total_candidates_screened == 2
    assert batch.rankings[0].candidate_id == "c1"
    assert batch.rankings[0].rank == 1
    assert batch.rankings[1].candidate_id == "c2"

def test_hallucination_verification_grounded(engine):
    resume = "Worked at TechCorp for 3 years as a Python and Docker engineer. Built automated CI/CD pipelines."
    claim = "Candidate has experience with Python and Docker."
    result = engine.verify_hallucination(resume, claim)
    assert result.is_grounded is True
    assert result.verdict == "VERIFIED_FACT"

def test_hallucination_verification_fabricated(engine):
    resume = "Rahul Kumar is a Data Analyst with 2 years of Python and SQL experience."
    fabricated_claim = "Candidate led multi-million dollar Quantum Computing implementations at NASA."
    result = engine.verify_hallucination(resume, fabricated_claim)
    assert result.is_grounded is False
    assert result.verdict == "HALLUCINATION_DETECTED"
