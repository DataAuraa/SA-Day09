"""
Command-Line Interface (CLI) for AI HR Assistant & Resume Screener
Usage:
    python cli.py --demo
    python cli.py --candidate cand_01 --job job_ds
"""

import sys
import os
import json
import argparse

# Enable parent package import if run directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from ai_hr_assistant_project.engine import engine
    from ai_hr_assistant_project.models import CandidateProfile, JobDescription
    from ai_hr_assistant_project.config import settings
except ImportError:
    from engine import engine
    from models import CandidateProfile, JobDescription
    from config import settings

def print_banner():
    print("=" * 72)
    print("  SARATHA UNIVERSITY • DAY 09 GENERATIVE AI & LLM ENGINEERING")
    print("  AI HR Assistant & Resume Screener — Terminal CLI")
    print("=" * 72)

def load_data():
    with open(settings.RESUMES_FILE, "r", encoding="utf-8") as f:
        resumes = [CandidateProfile(**x) for x in json.load(f)]
    with open(settings.JOBS_FILE, "r", encoding="utf-8") as f:
        jobs = [JobDescription(**x) for x in json.load(f)]
    return resumes, jobs

def run_demo():
    print_banner()
    resumes, jobs = load_data()
    job = jobs[0] # Data Scientist

    print(f"\n[TARGET JOB REQUISITION]")
    print(f"  Title:           {job.title} ({job.department})")
    print(f"  Min Experience:  {job.min_experience_years} years")
    print(f"  Required Skills: {', '.join(job.required_skills)}")
    print("-" * 72)

    print("\n[BATCH EVALUATION & RANKING OF 6 CANDIDATES]\n")
    batch_res = engine.batch_screen(resumes, job)

    print(f"{'RANK':<5} | {'CANDIDATE':<18} | {'SCORE':<7} | {'DECISION':<28} | {'MATCHED/REQ'}")
    print("-" * 72)
    for r in batch_res.rankings:
        star = " *" if r.rank == 1 else ""
        print(f"#{r.rank:<4} | {r.candidate_name:<18} | {r.match_score:>5.1f}% | {r.decision:<28} | {r.matched_skills_count} skills{star}")

    print("-" * 72)
    top_cand = next(c for c in resumes if c.id == batch_res.top_candidate.candidate_id)
    detailed = engine.screen_candidate(top_cand, job)

    print(f"\n[DEEP-DIVE EVALUATION: #1 TOP CANDIDATE -> {detailed.candidate_name}]")
    print(f"  Score:           {detailed.match_score}% ({detailed.decision})")
    print(f"  Matched Skills:  {', '.join(detailed.matched_required_skills)}")
    print(f"  Missing Skills:  {', '.join(detailed.missing_required_skills) if detailed.missing_required_skills else 'None (100% matched)'}")
    print(f"  Experience:      {top_cand.experience_years} yrs (Delta: {detailed.experience_gap_years:+.1f} yrs)")
    print(f"  Inference Time:  {detailed.latency_ms} ms")

    print("\n[GENERATED STAR TECHNICAL INTERVIEW QUESTIONS]")
    for i, q in enumerate(detailed.interview_questions, 1):
        print(f"\n  Q{i}. [{q.topic}]")
        print(f"      Question: {q.question}")
        print(f"      Guidance: {q.expected_answer_guidance}")

    print("\n" + "=" * 72)
    print("Demo completed successfully. Run 'python main.py' to launch FastAPI Swagger docs.")

def main():
    parser = argparse.ArgumentParser(description="AI HR Assistant & Resume Screener CLI")
    parser.add_argument("--demo", action="store_true", help="Run complete demo ranking 6 candidates against Data Scientist role")
    parser.add_argument("--candidate", type=str, default=None, help="Candidate ID (e.g. cand_01 to cand_06)")
    parser.add_argument("--job", type=str, default=None, help="Job ID (e.g. job_ds, job_ai_llm, job_devops, job_fullstack)")

    args = parser.parse_args()

    if args.demo or (not args.candidate and not args.job):
        run_demo()
    else:
        resumes, jobs = load_data()
        cand = next((c for c in resumes if c.id == args.candidate), None)
        job = next((j for j in jobs if j.id == args.job), None)

        if not cand:
            print(f"Error: Candidate '{args.candidate}' not found.")
            sys.exit(1)
        if not job:
            print(f"Error: Job '{args.job}' not found.")
            sys.exit(1)

        print_banner()
        res = engine.screen_candidate(cand, job)
        print(f"\nCandidate: {cand.name} | Target Job: {job.title}")
        print(f"Match Score: {res.match_score}% | Decision: {res.decision}")
        print(f"Matched Skills: {', '.join(res.matched_required_skills)}")
        print(f"Missing Skills: {', '.join(res.missing_required_skills) if res.missing_required_skills else 'None'}")
        print(f"Latency: {res.latency_ms}ms\n")

if __name__ == "__main__":
    main()
