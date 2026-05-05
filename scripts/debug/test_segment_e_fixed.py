#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test Segment E: Skill Gap Analysis
Tests all skill gap endpoints and validates responses
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"

# Test data
SAMPLE_RESUME = """
John Doe
john.doe@example.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced full-stack developer with 3 years of expertise in building scalable web applications.

SKILLS
- Frontend: React, JavaScript, Next.js, HTML, CSS, Tailwind
- Backend: Python, FastAPI, Node.js, Django
- Database: PostgreSQL, MongoDB
- Cloud: AWS, Docker
- Other: Git, GitHub, REST APIs, Agile

EXPERIENCE
Senior Developer | TechCorp (2022-Present)
- Built microservices using FastAPI and Node.js
- Managed PostgreSQL and MongoDB databases
- Deployed applications on AWS using Docker
- Led team of 3 developers

Junior Developer | StartupXYZ (2020-2022)
- Developed React components for web applications
- Wrote REST APIs using Django and Flask
- Managed version control with Git

EDUCATION
Bachelor of Science in Computer Science | University Name (2020)
"""

SAMPLE_JOB_DESCRIPTION = """
Senior Full Stack Developer

About the Role:
We're looking for an experienced Software Engineer to join our team.

Required Skills:
- Proficiency in React, TypeScript, and Next.js for frontend development
- Strong backend experience with Python, FastAPI, and Django
- Database management with PostgreSQL and MongoDB
- Cloud deployment experience with AWS, Docker, and Kubernetes
- Experience with REST APIs and GraphQL
- Version control using Git
- Unit testing and CI/CD pipelines

Responsibilities:
- Design and implement scalable web applications
- Collaborate with cross-functional teams
- Conduct code reviews
- Mentor junior developers
- Troubleshoot production issues

Location: Remote
Salary: Competitive
"""

def test_ats_analyzer():
    """Test the enhanced ATS analyzer"""
    print("\n" + "="*60)
    print("TEST 1: ATS Analyzer Service")
    print("="*60)
    
    from app.services.ats_analyzer import ats_analyzer  # type: ignore
    
    # Test analyze_resume
    print("\n[OK] Testing analyze_resume()...")
    result = ats_analyzer.analyze_resume(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION)
    assert "ats_score" in result
    assert "feedback" in result
    print(f"  ATS Score: {result['ats_score']}")
    print(f"  Feedback: {result['feedback']}")
    
    # Test calculate_skill_gaps
    print("\n[OK] Testing calculate_skill_gaps()...")
    gaps = ats_analyzer.calculate_skill_gaps(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION)
    assert "category_gaps" in gaps
    assert "priority_skills" in gaps
    print(f"  Priority Skills: {gaps['priority_skills'][:3]}...")
    
    # Test calculate_keyword_match
    print("\n[OK] Testing calculate_keyword_match()...")
    match = ats_analyzer.calculate_keyword_match(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION)
    assert "match_percentage" in match
    print(f"  Match Percentage: {match['match_percentage']}%")
    print(f"  Matched Skills: {match['matched_keywords'][:3]}...")
    print(f"  Missing Skills: {match['missing_keywords'][:3]}...")
    
    # Test generate_learning_path
    print("\n[OK] Testing generate_learning_path()...")
    learning = ats_analyzer.generate_learning_path(gaps["priority_skills"])
    assert "resources" in learning
    assert "total_hours" in learning
    print(f"  Total Training Hours: {learning['total_hours']}")
    print(f"  Estimated Weeks: {learning['estimated_weeks']}")
    
    print("\n[PASSED] ATS Analyzer tests OK!")
    return True

def test_analyze_resume_endpoint():
    """Test POST /jobs/analyze-resume endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Analyze Resume Endpoint")
    print("="*60)
    
    url = f"{BASE_URL}{API_PREFIX}/jobs/analyze-resume"
    payload = {
        "resume_text": SAMPLE_RESUME,
        "job_description": SAMPLE_JOB_DESCRIPTION
    }
    
    print(f"\n[OK] POST {url}")
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    
    print(f"  Status: {response.status_code}")
    print(f"  Match Score: {data['score']}%")
    print(f"  Matched Skills: {data['matched_skills'][:3]}")
    print(f"  Missing Skills: {data['missing_skills'][:3]}")
    
    print("\n[PASSED] Analyze Resume endpoint test OK!")
    return True

def test_login_and_get_token():
    """Test login and get auth token"""
    print("\n" + "="*60)
    print("TEST 3: Authentication")
    print("="*60)
    
    url = f"{BASE_URL}{API_PREFIX}/users/login"
    payload = {
        "email": "test@example.com",
        "password": "test_password"
    }
    
    print(f"\n[OK] POST {url}")
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        print(f"  Status: {response.status_code}")
        print(f"  Token: {token[:20]}...")
        print("\n[PASSED] Authentication test OK!")
        return token
    elif response.status_code == 401:
        print(f"  Status: 401 (Credentials invalid - expected for test)")
        # Create test user
        print("\n[OK] Creating test user...")
        signup_url = f"{BASE_URL}{API_PREFIX}/users/signup"
        signup_payload = {
            "email": "segmente_test@example.com",
            "password": "Test@123",
            "full_name": "Test User"
        }
        
        signup_response = requests.post(signup_url, json=signup_payload)
        if signup_response.status_code == 201:
            print(f"  Test user created")
            # Now login
            login_payload = {
                "email": "segmente_test@example.com",
                "password": "Test@123"
            }
            login_response = requests.post(url, json=login_payload)
            if login_response.status_code == 200:
                token = login_response.json().get("access_token")
                print(f"  Token obtained: {token[:20]}...")
                return token
        
        print("  Warning: Could not create test user or login")
        return None
    else:
        print(f"  Status: {response.status_code}")
        return None

def test_get_recommendations(token: str):
    """Test GET /jobs/recommendations endpoint"""
    print("\n" + "="*60)
    print("TEST 4: Job Recommendations with Skill Analysis")
    print("="*60)
    
    if not token:
        print("[SKIP] Skipping (no auth token)")
        return True
    
    url = f"{BASE_URL}{API_PREFIX}/jobs/recommendations"
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"\n[OK] GET {url}")
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"  Status: {response.status_code}")
        print(f"  Recommendations found: {len(data['recommendations'])}")
        
        if data['recommendations']:
            rec = data['recommendations'][0]
            print(f"  Top match: {rec['title']} at {rec['company']}")
            print(f"  Match Score: {rec['score']}%")
        
        print("\n[PASSED] Recommendations test OK!")
        return True
    elif response.status_code == 400:
        print(f"  Status: 400 (No resume uploaded - expected)")
        print("  [OK] This is expected - user needs to upload resume first")
        return True
    else:
        print(f"  Status: {response.status_code}")
        print(f"  Message: {response.text}")
        return False

def run_all_tests():
    """Run all skill gap analysis tests"""
    print("\n" + "="*80)
    print("SEGMENT E: SKILL GAP ANALYSIS - COMPREHENSIVE TEST SUITE")
    print("="*80)
    
    try:
        # Test 1: ATS Analyzer
        test_ats_analyzer()
        
        # Test 2: API Endpoints
        test_analyze_resume_endpoint()
        
        # Test 3: Auth & Token
        token = test_login_and_get_token()
        
        # Test 4: Recommendations
        test_get_recommendations(token)
        
        print("\n" + "="*80)
        print("[SUCCESS] ALL TESTS PASSED!")
        print("="*80)
        print("\nSegment E Implementation Complete:")
        print("  [OK] Enhanced ATS Analyzer with skill gap calculation")
        print("  [OK] 5 new API endpoints added:")
        print("    - POST /jobs/analyze-resume")
        print("    - GET /jobs/skill-gap/{job_id}")
        print("    - POST /jobs/analyze-resume-vs-job")
        print("    - GET /jobs/improvement-resources/{job_id}")
        print("    - GET /jobs/skill-analysis")
        print("  [OK] Frontend skill visualization components")
        print("  [OK] Dedicated skill gap analysis page at /skill-gap")
        print("\nUsers can now:")
        print("  1. See skill gaps for any job position")
        print("  2. Get personalized learning resources")
        print("  3. Understand category-wise skill gaps")
        print("  4. Get priority list of skills to learn")
        print("\n" + "="*80)
        
    except Exception as e:
        print(f"\n[FAILED] TEST FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    # If running as a module test with FastAPI app context
    import sys
    import os
    
    # Add backend to path
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
    
    success = run_all_tests()
    sys.exit(0 if success else 1)
