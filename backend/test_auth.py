import httpx
import json

async def test_login():
    """Test login endpoint"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/api/v1/auth/login",
                json={"email": "test@test.com", "password": "test123456"},
                timeout=10
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

async def test_signup():
    """Test signup endpoint"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/api/v1/auth/signup",
                json={
                    "email": "newuser@test.com",
                    "password": "test123456",
                    "full_name": "Test User"
                },
                timeout=10
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

import asyncio

print("=== Testing Login ===")
asyncio.run(test_login())

print("\n=== Testing Signup ===")
asyncio.run(test_signup())
