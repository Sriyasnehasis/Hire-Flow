import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def fetch_india_jobs(keyword: str = "Developer", location: str = "Bangalore"):
    # Pulling credentials from your .env file
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    
    # Adzuna India endpoint
    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": keyword,
        "where": location,
        "content-type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()