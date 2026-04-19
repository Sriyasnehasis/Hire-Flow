import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def fetch_india_jobs(keyword: str = "Developer", location: str = "India"):
    """
    Fetch live job listings from Adzuna India API.
    Returns real job data including title, company, location, salary, and apply URL.
    """
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    
    if not app_id or not app_key:
        raise Exception("Adzuna API credentials not configured")
    
    # Adzuna India endpoint
    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": keyword,
        "where": location,
        "results_per_page": 20,
        "content-type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()