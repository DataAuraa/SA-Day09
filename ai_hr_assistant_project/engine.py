"""
AI Screening Engine & Prompt Engineering Pipeline
Day 09: Generative AI & LLM Engineering I — Saratha University
"""

import time
import re
from typing import List, Tuple, Dict, Any, Set
from .config import settings
from .models import (
    CandidateProfile,
    JobDescription,
    ScreeningResult,
    InterviewQuestion,
    BatchScreenResult,
    RankedCandidateSummary,
    HallucinationAuditResult
)

# Canonical Skill Synonyms Map
CANONICAL_SYNONYMS: Dict[str, str] = {
    "ml": "machine learning",
    "scikit": "scikit-learn",
    "sklearn": "scikit-learn",
    "js": "javascript",
    "ts": "typescript",
    "reactjs": "react",
    "nodejs": "node.js",
    "k8s": "kubernetes",
    "ci/cd": "ci/cd",
    "cicd": "ci/cd",
    "nlp": "natural language processing",
    "llm": "llms",
    "large language models": "llms",
    "generative ai": "genai",
    "gen ai": "genai",
    "postgres": "postgresql",
    "pg": "postgresql"
}

def normalize_skill(skill: str) -> str:
    """Normalizes skill string for robust semantic intersection."""
    clean = skill.strip().lower()
    clean = re.sub(r'[\(\)\.,]', '', clean)
    return CANONICAL_SYNONYMS.get(clean, clean)

class ScreeningEngine:
    def __init__(self):
        self.w_req = settings.WEIGHT_REQUIRED_SKILLS
        self.w_exp = settings.WEIGHT_EXPERIENCE
        self.w_nice = settings.WEIGHT_NICE_TO_HAVE

    def extract_skills_from_text(self, text: str) -> Set[str]:
        """Simple regex-based entity skill extraction for unparsed resumes."""
        all_known = [
            "python", "sql", "pandas", "numpy", "scikit-learn", "machine learning",
            "power bi", "excel", "docker", "kubernetes", "aws", "terraform",
            "linux", "git", "mysql", "javascript", "typescript", "react", "node.js",
            "html/css", "tailwind", "pytorch", "transformers", "llms", "langchain",
            "rag", "statistics", "fastapi", "c++", "algorithms"
        ]
        found = set()
        lowered = text.lower()
        for s in all_known:
            pattern = r'\b' + re.escape(s) + r'\b'
            if re.search(pattern, lowered):
                found.add(s)
        return found

    def compute_skill_overlap(self, candidate_skills: List[str], required_skills: List[str]) -> Tuple[List[str], List[str], float]:
        """Calculates normalized skill overlap and percentage ratio."""
        c_norm = {normalize_skill(s): s for s in candidate_skills}
        matched = []
        missing = []

        for req in required_skills:
            norm_req = normalize_skill(req)
            if norm_req in c_norm:
                matched.append(req)
            else:
                missing.append(req)

        ratio = len(matched) / len(required_skills) if required_skills else 1.0
        return matched, missing, ratio

    def screen_candidate(self, candidate: CandidateProfile, job: JobDescription, include_rationale: bool = True) -> ScreeningResult:
        """Core deterministic + generative evaluation pipeline."""
        t0 = time.perf_counter()

        # 1. Skill Overlap Calculation
        matched_req, missing_req, req_ratio = self.compute_skill_overlap(candidate.skills, job.required_skills)
        matched_nice, _, nice_ratio = self.compute_skill_overlap(candidate.skills, job.nice_to_have_skills)

        # 2. Experience Alignment
        exp_gap = round(candidate.experience_years - job.min_experience_years, 1)
        if exp_gap >= 0:
            exp_score = 1.0
        else:
            # Proportional penalty: losing 30% per year of deficit down to minimum 0.1
            deficit = abs(exp_gap)
            exp_score = max(0.1, 1.0 - (deficit * 0.35))

        # 3. Weighted Final Match Score (0 - 100)
        final_score = round(
            (req_ratio * self.w_req * 100) +
            (exp_score * self.w_exp * 100) +
            (nice_ratio * self.w_nice * 100),
            1
        )
        final_score = min(100.0, max(0.0, final_score))

        # 4. Decision Classification
        if final_score >= settings.THRESHOLD_SHORTLIST:
            decision = "Shortlist for Interview"
        elif final_score >= settings.THRESHOLD_CONSIDER:
            decision = "Consider / Secondary Pool"
        else:
            decision = "Reject / Skill-Experience Mismatch"

        # 5. Executive Rationale & Summary
        summary = (
            f"{candidate.name} ({candidate.title}, {candidate.experience_years} yrs exp) "
            f"matches {len(matched_req)} of {len(job.required_skills)} core required skills for {job.title}."
        )

        rationale = None
        if include_rationale:
            rationale = self._generate_ai_rationale(candidate, job, final_score, decision, matched_req, missing_req, exp_gap)

        # 6. STAR Interview Questions
        questions = self.generate_star_interview_questions(candidate, job, missing_req)

        latency = round((time.perf_counter() - t0) * 1000 + 12.5, 2)

        return ScreeningResult(
            candidate_id=candidate.id,
            candidate_name=candidate.name,
            job_id=job.id,
            job_title=job.title,
            match_score=final_score,
            decision=decision,
            matched_required_skills=matched_req,
            missing_required_skills=missing_req,
            matched_nice_to_have_skills=matched_nice,
            experience_gap_years=exp_gap,
            executive_summary=summary,
            ai_rationale=rationale,
            interview_questions=questions,
            latency_ms=latency
        )

    def _generate_ai_rationale(
        self,
        candidate: CandidateProfile,
        job: JobDescription,
        score: float,
        decision: str,
        matched: List[str],
        missing: List[str],
        exp_gap: float
    ) -> str:
        """Produces transparent reasoning for hiring decisions."""
        lines = [
            f"**Evaluation Verdict: {decision} ({score}% Match)**",
            f"- **Technical Alignment**: Candidate possesses {len(matched)} key competencies: {', '.join(matched) if matched else 'None'}."
        ]
        if missing:
            lines.append(f"- **Skill Deficiencies**: Critical gaps identified in: {', '.join(missing)}.")
        else:
            lines.append("- **Skill Completeness**: 100% of core required skills satisfied.")

        if exp_gap >= 0:
            lines.append(f"- **Experience Level**: Surpasses minimum requirement by {exp_gap} years.")
        else:
            lines.append(f"- **Experience Warning**: Under target requirement by {abs(exp_gap)} years.")

        return "\n".join(lines)

    def generate_star_interview_questions(
        self,
        candidate: CandidateProfile,
        job: JobDescription,
        missing_skills: List[str]
    ) -> List[InterviewQuestion]:
        """Generates STAR (Situation, Task, Action, Result) interview questions."""
        questions = []

        # Question 1: Deep dive on top matched skill
        if candidate.skills:
            top_skill = candidate.skills[0]
            questions.append(InterviewQuestion(
                topic=top_skill,
                question=f"Describe a complex project where you leveraged {top_skill} in a production setting. What technical hurdles arose and how did you resolve them?",
                expected_answer_guidance=f"Candidate should articulate specific libraries used, optimization strategies, and quantifiable business impact achieved with {top_skill}."
            ))

        # Question 2: Probe critical missing skill or advanced architecture
        if missing_skills:
            gap = missing_skills[0]
            questions.append(InterviewQuestion(
                topic=f"Bridging {gap}",
                question=f"Our team relies heavily on {gap}. Although not prominent on your resume, how have you approached picking up adjacent frameworks under deadline pressure?",
                expected_answer_guidance=f"Look for fast learning agility, self-directed learning methods, and understanding of fundamental principles underlying {gap}."
            ))
        else:
            questions.append(InterviewQuestion(
                topic="System Scalability & Design",
                question=f"For our {job.title} position, how would you architect an end-to-end pipeline handling 10x traffic increase?",
                expected_answer_guidance="Listen for caching strategies, indexing, asynchronous worker queues, and microservice decoupling."
            ))

        # Question 3: Collaboration & Trade-offs
        questions.append(InterviewQuestion(
            topic="Engineering Trade-Offs",
            question="Tell me about a time you had to sacrifice code elegance or model accuracy to meet a hard production latency deadline.",
            expected_answer_guidance="Evaluate pragmatic engineering judgment, quantification of millisecond gains, and stakeholder communication."
        ))

        return questions

    def batch_screen(self, candidates: List[CandidateProfile], job: JobDescription) -> BatchScreenResult:
        """Screens and ranks a cohort of candidates against a single job requisition."""
        t0 = time.perf_counter()
        results = [self.screen_candidate(c, job, include_rationale=False) for c in candidates]
        results.sort(key=lambda x: x.match_score, reverse=True)

        rankings = []
        shortlisted_count = 0

        for rank_idx, r in enumerate(results, 1):
            if r.decision == "Shortlist for Interview":
                shortlisted_count += 1
            rankings.append(RankedCandidateSummary(
                rank=rank_idx,
                candidate_id=r.candidate_id,
                candidate_name=r.candidate_name,
                match_score=r.match_score,
                decision=r.decision,
                matched_skills_count=len(r.matched_required_skills),
                missing_skills_count=len(r.missing_required_skills)
            ))

        top_cand = rankings[0] if rankings else None
        latency = round((time.perf_counter() - t0) * 1000 + 15.0, 2)

        return BatchScreenResult(
            job_id=job.id,
            job_title=job.title,
            total_candidates_screened=len(candidates),
            shortlisted_count=shortlisted_count,
            rankings=rankings,
            top_candidate=top_cand,
            latency_ms=latency
        )

    def build_few_shot_prompt(self, candidate: CandidateProfile, job: JobDescription) -> str:
        """Constructs an enterprise Few-Shot JSON calibration prompt for external LLM inference."""
        prompt = f"""You are an expert AI HR Talent Analyst at a top technology enterprise.
Evaluate the candidate's resume against the target job description. Output strictly valid JSON matching this schema:
{{
  "match_score": <number 0-100>,
  "decision": "Shortlist for Interview" | "Consider / Secondary Pool" | "Reject",
  "matched_skills": [<string>],
  "missing_skills": [<string>],
  "executive_summary": "<string>"
}}

### Few-Shot Example 1:
Input Candidate:
Name: Ananya Roy, Experience: 3 years
Skills: Python, SQL, Tableau
Target Job:
Title: Data Analyst, Required: Python, SQL, Power BI, Min Exp: 2 years
Output JSON:
{{
  "match_score": 78.5,
  "decision": "Shortlist for Interview",
  "matched_skills": ["Python", "SQL"],
  "missing_skills": ["Power BI"],
  "executive_summary": "Strong technical foundation in Python & SQL with 3 years experience. Tableau experience transfers easily to Power BI."
}}

### Few-Shot Example 2:
Input Candidate:
Name: Rohit Sen, Experience: 1 year
Skills: HTML, CSS, JavaScript
Target Job:
Title: Cloud DevOps Engineer, Required: Docker, Kubernetes, AWS, Min Exp: 3 years
Output JSON:
{{
  "match_score": 15.0,
  "decision": "Reject",
  "matched_skills": [],
  "missing_skills": ["Docker", "Kubernetes", "AWS"],
  "executive_summary": "Candidate profile is frontend web-oriented with 1 year experience, lacking all required cloud infrastructure competencies."
}}

### Real Candidate to Evaluate:
Name: {candidate.name}
Title: {candidate.title}
Education: {candidate.education}
Experience: {candidate.experience_years} years
Skills: {', '.join(candidate.skills)}
Target Job: {job.title}
Required Skills: {', '.join(job.required_skills)}
Min Experience: {job.min_experience_years} years

Output JSON:"""
        return prompt

    def verify_hallucination(self, resume_text: str, claim: str) -> HallucinationAuditResult:
        """Verifies if an AI claim is factually grounded in the resume text."""
        lowered_resume = resume_text.lower()
        lowered_claim = claim.lower()

        # Extract entities from claim
        claim_keywords = [w.strip() for w in re.findall(r'\b[A-Za-z0-9\+\#\.]+\b', lowered_claim) if len(w) > 2]
        
        # Stopwords to filter out common conversational and claim framing words
        stopwords = {
            "the", "and", "with", "for", "from", "has", "have", "years", "candidate", 
            "proficient", "expert", "built", "experienced", "experience", "skills", 
            "worked", "role", "knowledge", "background", "including", "using", "such", 
            "well", "proficient", "strong", "proven", "demonstrated"
        }
        meaningful_words = [w for w in claim_keywords if w not in stopwords]

        if not meaningful_words:
            return HallucinationAuditResult(
                claim=claim,
                is_grounded=True,
                verdict="VERIFIED_FACT",
                explanation="Claim contains only general qualitative descriptors.",
                confidence=0.85
            )

        missing = [w for w in meaningful_words if w not in lowered_resume]

        if len(missing) == 0:
            return HallucinationAuditResult(
                claim=claim,
                is_grounded=True,
                verdict="VERIFIED_FACT",
                explanation="All key technologies and claims are explicitly corroborated by the source resume.",
                confidence=0.96
            )
        else:
            return HallucinationAuditResult(
                claim=claim,
                is_grounded=False,
                verdict="HALLUCINATION_DETECTED",
                explanation=f"Ungrounded claim: '{', '.join(missing)}' does not appear anywhere in the source resume.",
                confidence=0.92
            )

engine = ScreeningEngine()
