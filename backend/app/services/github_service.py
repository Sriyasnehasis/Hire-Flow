import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def get_github_stack():
    """
    Fetches the user's tech stack from their GitHub repositories 
    using the GITHUB_TOKEN stored in the .env file.
    """
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Authorization": f"token {token}"}
    
    # This URL fetches all your repositories
    url = "https://api.github.com/user/repos?visibility=all"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        
        # If the token is wrong, GitHub returns a dict with 'message'
        if response.status_code != 200:
            return []
            
        repos = response.json()
        
        # We use a set to keep only unique languages
        verified_skills = {repo.get("language") for repo in repos if repo.get("language")}
        return list(verified_skills)