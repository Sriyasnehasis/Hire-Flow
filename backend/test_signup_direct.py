#!/usr/bin/env python
"""Test signup endpoint"""
import httpx
import asyncio
import json

async def test_signup():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/api/v1/auth/signup",
                json={
                    "email": "testuser@example.com",
                    "password": "test123456",
                    "full_name": "Test User"
                },
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_signup())
