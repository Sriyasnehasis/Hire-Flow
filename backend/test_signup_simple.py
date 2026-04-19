#!/usr/bin/env python3
import requests
import json

try:
    response = requests.post(
        "http://localhost:8000/api/v1/auth/signup",
        json={
            "email": "test2@example.com",
            "password": "test123456",
            "full_name": "Test User"
        }
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
        
except Exception as e:
    print(f"Error: {e}")
