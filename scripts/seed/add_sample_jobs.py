import requests
import json

# Sample jobs to add
jobs = [
    {
        'title': 'Senior Full Stack Developer',
        'company': 'Google',
        'location': 'Mountain View, CA',
        'description': 'Looking for experienced Full Stack developer with React, Python, and cloud experience',
        'required_skills': ['react', 'next.js', 'typescript', 'python', 'fastapi', 'postgresql', 'aws', 'docker'],
        'salary_min': 150000,
        'salary_max': 200000
    },
    {
        'title': 'Backend Engineer',
        'company': 'Microsoft',
        'location': 'Seattle, WA',
        'description': 'Python and Node.js backend engineer needed',
        'required_skills': ['python', 'django', 'node.js', 'mongodb', 'kubernetes', 'ci/cd'],
        'salary_min': 140000,
        'salary_max': 190000
    },
    {
        'title': 'Frontend Developer',
        'company': 'Facebook',
        'location': 'Menlo Park, CA',
        'description': 'React specialist for building user interfaces',
        'required_skills': ['react', 'javascript', 'css', 'html', 'redux', 'testing-library'],
        'salary_min': 130000,
        'salary_max': 180000
    }
]

# Add jobs
for job in jobs:
    try:
        response = requests.post('http://localhost:8000/api/v1/jobs/save-job', json=job)
        print(f'Added: {job["title"]} at {job["company"]} - Status: {response.status_code}')
    except Exception as e:
        print(f'Error adding {job["title"]}: {e}')

print('\nDone! Sample jobs added to database!')
