"""
GitHub integration API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import security_service
from app.models.user import User
from app.services.github_service import (
    GitHubOAuthService,
    GitHubAPIService,
    GitHubDataService,
)

router = APIRouter(prefix="/github", tags=["github"])


# Dependency function to get current user
async def get_current_user(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user from token"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/auth/url")
async def get_github_auth_url():
    """
    Get GitHub OAuth authorization URL
    
    Returns:
        auth_url: URL to redirect user to GitHub
    """
    return {
        "auth_url": GitHubOAuthService.get_authorization_url(),
        "description": "Redirect user to this URL to initiate GitHub OAuth flow",
    }


@router.post("/auth/callback")
async def github_oauth_callback(
    code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Handle GitHub OAuth callback
    
    Args:
        code: Authorization code from GitHub
        
    Returns:
        success: Whether OAuth was successful
        message: Status message
    """
    print(f"[GitHub Callback] Received code: {code[:20]}...")
    print(f"[GitHub Callback] Current user: {current_user.id}")
    
    # Exchange code for access token
    token_response = await GitHubOAuthService.exchange_code_for_token(code)
    
    print(f"[GitHub Callback] Token response: {token_response}")
    
    if not token_response or "access_token" not in token_response:
        error_msg = f"Failed to exchange code for access token. Response: {token_response}"
        print(f"[GitHub Callback] ERROR: {error_msg}")
        raise HTTPException(
            status_code=400,
            detail=error_msg,
        )
    
    access_token = token_response.get("access_token")
    print(f"[GitHub Callback] Got access token: {access_token[:20]}...")
    
    # Store access token
    current_user.github_access_token = access_token
    
    # Sync GitHub data
    success = await GitHubDataService.sync_github_data(current_user, db)
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Failed to sync GitHub data",
        )
    
    return {
        "success": True,
        "message": "GitHub account connected successfully!",
        "github_username": current_user.github_username,
    }


@router.post("/sync")
async def sync_github_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Manually sync GitHub data for current user
    
    Returns:
        success: Whether sync was successful
        message: Status message
        stats: Updated GitHub stats
    """
    if not current_user.github_access_token:
        raise HTTPException(
            status_code=400,
            detail="GitHub not connected. Please authorize first.",
        )
    
    success = await GitHubDataService.sync_github_data(current_user, db)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to sync GitHub data",
        )
    
    # Refresh user data from DB
    db.refresh(current_user)
    
    stats = GitHubDataService.get_github_stats(current_user)
    
    return {
        "success": True,
        "message": "GitHub data synced successfully!",
        "stats": stats,
    }


@router.get("/stats")
async def get_github_stats(
    current_user: User = Depends(get_current_user),
):
    """
    Get GitHub statistics for current user
    
    Returns:
        stats: GitHub statistics including repos count, stars, languages
    """
    if not current_user.github_username:
        raise HTTPException(
            status_code=400,
            detail="GitHub not connected",
        )
    
    stats = GitHubDataService.get_github_stats(current_user)
    
    return {
        "connected": True,
        "stats": stats,
    }


@router.get("/projects")
async def get_github_projects(
    limit: int = Query(15, ge=1, le=50),
    current_user: User = Depends(get_current_user),
):
    """
    Get GitHub projects/repositories for current user
    
    Args:
        limit: Maximum number of projects to return (1-50)
        
    Returns:
        projects: List of repositories with details
    """
    if not current_user.github_access_token:
        raise HTTPException(
            status_code=400,
            detail="GitHub not connected",
        )
    
    projects = await GitHubDataService.get_github_projects(current_user)
    
    return {
        "count": len(projects),
        "projects": projects[:limit],
    }


@router.delete("/disconnect")
async def disconnect_github(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Disconnect GitHub account from user profile
    
    Returns:
        success: Whether disconnection was successful
        message: Status message
    """
    # Clear GitHub data
    current_user.github_id = None
    current_user.github_username = None
    current_user.github_access_token = None
    current_user.github_refresh_token = None
    current_user.github_bio = None
    current_user.github_avatar_url = None
    current_user.github_profile_url = None
    current_user.github_repos_count = 0
    current_user.github_stars_total = 0
    current_user.github_languages = []
    current_user.github_last_synced = None
    
    db.commit()
    
    return {
        "success": True,
        "message": "GitHub account disconnected successfully",
    }


@router.get("/profile")
async def get_github_profile(
    username: str = Query(..., description="GitHub username"),
):
    """
    Get public GitHub profile information for any user
    
    Args:
        username: GitHub username
        
    Returns:
        profile: Public profile information
    """
    try:
        user_info = await GitHubAPIService.get_user_info("")  # Public API doesn't need token
        
        # For public data, we'd need to call a different endpoint
        # This is a simplified version - in production, use GitHub's public API
        return {
            "username": username,
            "profile_url": f"https://github.com/{username}",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch GitHub profile: {str(e)}",
        )
