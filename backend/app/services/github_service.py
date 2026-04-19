"""
GitHub Integration Service - OAuth, API calls, and data syncing
"""
import os
import json
import httpx
from datetime import datetime
from typing import Optional, Dict, List, Any
from sqlalchemy.orm import Session
from app.models.user import User


class GitHubOAuthService:
    """Handles GitHub OAuth 2.0 flow"""
    
    CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
    CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
    REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:3000/github-callback")
    AUTH_URL = "https://github.com/login/oauth/authorize"
    TOKEN_URL = "https://github.com/login/oauth/access_token"
    API_BASE_URL = "https://api.github.com"
    
    @classmethod
    def get_authorization_url(cls, state: str = "") -> str:
        """
        Generate GitHub OAuth authorization URL
        
        Args:
            state: Optional state parameter for CSRF protection
            
        Returns:
            Authorization URL
        """
        params = {
            "client_id": cls.CLIENT_ID,
            "redirect_uri": cls.REDIRECT_URI,
            "scope": "user:email read:user repo",  # Required scopes
            "allow_signup": "true",
        }
        
        if state:
            params["state"] = state
            
        query_string = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{cls.AUTH_URL}?{query_string}"
    
    @classmethod
    async def exchange_code_for_token(cls, code: str) -> Optional[Dict[str, Any]]:
        """
        Exchange authorization code for access token
        
        Args:
            code: Authorization code from GitHub
            
        Returns:
            Token response or None if failed
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    cls.TOKEN_URL,
                    headers={"Accept": "application/json"},
                    data={
                        "client_id": cls.CLIENT_ID,
                        "client_secret": cls.CLIENT_SECRET,
                        "code": code,
                        "redirect_uri": cls.REDIRECT_URI,
                    },
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"GitHub token exchange failed: {response.text}")
                    return None
        except Exception as e:
            print(f"Error exchanging GitHub code: {e}")
            return None


class GitHubAPIService:
    """Handles GitHub API calls for fetching user data and repositories"""
    
    API_BASE_URL = "https://api.github.com"
    
    @staticmethod
    async def get_user_info(access_token: str) -> Optional[Dict[str, Any]]:
        """
        Fetch authenticated user's profile information
        
        Args:
            access_token: GitHub OAuth access token
            
        Returns:
            User info or None if failed
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{GitHubAPIService.API_BASE_URL}/user",
                    headers={
                        "Authorization": f"token {access_token}",
                        "Accept": "application/vnd.github.v3+json",
                    },
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"Failed to fetch user info: {response.status_code}")
                    return None
        except Exception as e:
            print(f"Error fetching GitHub user info: {e}")
            return None
    
    @staticmethod
    async def get_user_repos(access_token: str, username: str) -> Optional[List[Dict[str, Any]]]:
        """
        Fetch all repositories for a user
        
        Args:
            access_token: GitHub OAuth access token
            username: GitHub username
            
        Returns:
            List of repositories or None if failed
        """
        try:
            all_repos = []
            page = 1
            per_page = 100
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                while True:
                    response = await client.get(
                        f"{GitHubAPIService.API_BASE_URL}/user/repos",
                        headers={
                            "Authorization": f"token {access_token}",
                            "Accept": "application/vnd.github.v3+json",
                        },
                        params={
                            "type": "owner",
                            "per_page": per_page,
                            "page": page,
                            "sort": "updated",
                        },
                    )
                    
                    if response.status_code != 200:
                        break
                    
                    repos = response.json()
                    if not repos:
                        break
                    
                    all_repos.extend(repos)
                    
                    # Check if there are more pages
                    if len(repos) < per_page:
                        break
                    
                    page += 1
            
            return all_repos if all_repos else []
        except Exception as e:
            print(f"Error fetching GitHub repos: {e}")
            return None
    
    @staticmethod
    async def get_repo_languages(access_token: str, owner: str, repo: str) -> Optional[Dict[str, int]]:
        """
        Fetch programming languages used in a repository
        
        Args:
            access_token: GitHub OAuth access token
            owner: Repository owner
            repo: Repository name
            
        Returns:
            Dictionary of languages and their byte counts or None if failed
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{GitHubAPIService.API_BASE_URL}/repos/{owner}/{repo}/languages",
                    headers={
                        "Authorization": f"token {access_token}",
                        "Accept": "application/vnd.github.v3+json",
                    },
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {}
        except Exception as e:
            print(f"Error fetching languages for {repo}: {e}")
            return None
    
    @staticmethod
    async def calculate_language_stats(
        access_token: str, repos: List[Dict[str, Any]]
    ) -> Dict[str, int]:
        """
        Calculate total language usage across all repositories
        
        Args:
            access_token: GitHub OAuth access token
            repos: List of repositories
            
        Returns:
            Dictionary with language usage counts
        """
        language_stats = {}
        
        try:
            for repo in repos:
                owner = repo["owner"]["login"]
                repo_name = repo["name"]
                
                languages = await GitHubAPIService.get_repo_languages(
                    access_token, owner, repo_name
                )
                
                if languages:
                    for language, bytes_count in languages.items():
                        if language not in language_stats:
                            language_stats[language] = 0
                        language_stats[language] += bytes_count
            
            # Sort by count and return top languages
            sorted_languages = sorted(
                language_stats.items(), key=lambda x: x[1], reverse=True
            )
            
            return {lang: count for lang, count in sorted_languages}
        except Exception as e:
            print(f"Error calculating language stats: {e}")
            return {}


class GitHubDataService:
    """Orchestrates GitHub data sync and storage"""
    
    @staticmethod
    async def sync_github_data(user: User, db: Session) -> bool:
        """
        Sync GitHub data for a user
        
        Args:
            user: User object
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        if not user.github_access_token:
            return False
        
        try:
            # Fetch user info
            user_info = await GitHubAPIService.get_user_info(user.github_access_token)
            if not user_info:
                return False
            
            # Update user with GitHub info
            user.github_id = str(user_info.get("id"))
            user.github_username = user_info.get("login")
            user.github_bio = user_info.get("bio")
            user.github_avatar_url = user_info.get("avatar_url")
            user.github_profile_url = user_info.get("html_url")
            
            # Fetch repositories
            repos = await GitHubAPIService.get_user_repos(
                user.github_access_token, user.github_username
            )
            
            if repos:
                user.github_repos_count = len(repos)
                
                # Calculate stats
                total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
                user.github_stars_total = total_stars
                
                # Get language stats
                language_stats = await GitHubAPIService.calculate_language_stats(
                    user.github_access_token, repos
                )
                
                # Convert to list of dicts for JSON storage
                user.github_languages = [
                    {"language": lang, "count": count}
                    for lang, count in language_stats.items()
                ][:10]  # Top 10 languages
            
            user.github_last_synced = datetime.utcnow()
            db.commit()
            return True
            
        except Exception as e:
            print(f"Error syncing GitHub data: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def get_github_stats(user: User) -> Dict[str, Any]:
        """
        Get formatted GitHub stats for a user
        
        Args:
            user: User object
            
        Returns:
            Dictionary with GitHub stats
        """
        if not user.github_username:
            return {}
        
        return {
            "username": user.github_username,
            "avatar_url": user.github_avatar_url,
            "profile_url": user.github_profile_url,
            "bio": user.github_bio,
            "repositories_count": user.github_repos_count,
            "total_stars": user.github_stars_total,
            "top_languages": user.github_languages or [],
            "last_synced": user.github_last_synced.isoformat() if user.github_last_synced else None,
        }
    
    @staticmethod
    async def get_github_projects(user: User) -> List[Dict[str, Any]]:
        """
        Get GitHub projects/repositories for a user
        
        Args:
            user: User object
            
        Returns:
            List of repository details
        """
        if not user.github_access_token:
            return []
        
        try:
            repos = await GitHubAPIService.get_user_repos(
                user.github_access_token, user.github_username
            )
            
            if not repos:
                return []
            
            # Format repository data
            projects = []
            for repo in repos[:15]:  # Top 15 repos
                projects.append({
                    "id": repo["id"],
                    "name": repo["name"],
                    "description": repo["description"],
                    "url": repo["html_url"],
                    "language": repo["language"],
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "updated_at": repo["updated_at"],
                })
            
            return projects
        except Exception as e:
            print(f"Error fetching GitHub projects: {e}")
            return []