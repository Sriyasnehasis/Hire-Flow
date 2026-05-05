import requests

# Create a test user
signup_data = {
    "email": "demo@test.com",
    "password": "TestPassword123!",
    "name": "Demo User"
}

response = requests.post(
    'http://localhost:8000/api/v1/signup',
    json=signup_data
)

print(f"Signup Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    token = data.get('access_token')
    print(f"Token: {token}")
    
    # Now upload a sample resume
    resume_text = """
    John Doe
    Software Engineer
    
    SKILLS:
    - React, Next.js, TypeScript, JavaScript
    - Python, FastAPI, Django
    - PostgreSQL, MongoDB
    - AWS, Docker
    - HTML, CSS, Tailwind
    
    EXPERIENCE:
    Senior Developer at Tech Company (2 years)
    - Built web applications with React
    - Developed backend APIs with Python
    - Managed databases
    """
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    resume_response = requests.post(
        'http://localhost:8000/api/v1/users/upload-resume',
        json={'resume_text': resume_text},
        headers=headers
    )
    
    print(f"Resume Upload Status: {resume_response.status_code}")
    if resume_response.status_code == 200:
        print(f"Success! User created with token: {token}")
        print(f"\n1. Login with: demo@test.com / TestPassword123!")
        print(f"2. Then go to: http://localhost:3000/skill-gap")
else:
    print(f"Error: {response.text}")
