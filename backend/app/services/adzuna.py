import httpx
import os
import json
import logging
from dotenv import load_dotenv
from app.core.redis_client import redis_client

load_dotenv()

logger = logging.getLogger(__name__)

async def fetch_india_jobs(keyword: str = "Developer", location: str = "India"):
    """
    Fetch live job listings from Adzuna India API.
    Returns real job data including title, company, location, salary, and apply URL.
    """
    keyword_clean = (keyword or "Developer").strip()
    location_clean = (location or "India").strip()
    
    # Try fetching from Redis cache
    cache_key = f"adzuna:jobs:{keyword_clean.lower()}:{location_clean.lower()}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        try:
            logger.info(f"Adzuna cache hit for key: {cache_key}")
            return json.loads(cached_data)
        except Exception as e:
            logger.warning(f"Error parsing cached Adzuna JSON: {e}")

    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_API_KEY")
    
    if not app_id or not app_key or app_id == "your-adzuna-app-id":
        # Fallback for demo purposes if keys are missing
        fallback_data = {
            "results": [
                {
                    "title": "Software Engineer (AI)",
                    "company": {"display_name": "Tech Corp"},
                    "location": {"display_name": "Bangalore"},
                    "description": "Looking for a React and Python developer.",
                    "redirect_url": "https://example.com"
                }
            ],
            "count": 1
        }
        # Cache fallback briefly
        redis_client.set(cache_key, json.dumps(fallback_data), ex=300)
        return fallback_data
    
    # Adzuna India endpoint
    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": keyword_clean,
        "where": location_clean,
        "results_per_page": 20,
        "content-type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Cache successful response for 1 hour (3600 seconds)
        redis_client.set(cache_key, json.dumps(data), ex=3600)
        return data