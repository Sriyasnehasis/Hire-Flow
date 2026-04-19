import httpx
import asyncio
import json

async def test_github_credentials():
    client_id = "Ov23liBmLHUa5LRHPnZG"
    client_secret = "de78832425e2d4597c4f873e6bef3c505185852d"
    
    # Test with a dummy code to see if GitHub accepts the credentials
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": "test_code_12345",
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                data=data,
                headers={"Accept": "application/json"}
            )
            result = response.json()
            print("GitHub Response Status:", response.status_code)
            print("Response:", json.dumps(result, indent=2))
            
            if "error" in result:
                print(f"\n❌ ERROR: {result['error']}")
                if "error_description" in result:
                    print(f"Description: {result['error_description']}")
        except Exception as e:
            print(f"Exception: {e}")

asyncio.run(test_github_credentials())
