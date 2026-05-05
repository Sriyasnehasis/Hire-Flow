import sys
sys.path.insert(0, 'backend')

# Force refresh of SQLAlchemy table metadata
from sqlalchemy import inspect, text, create_engine
from app.core.config import settings
from app.core.db import Base, engine as app_engine

print("Refreshing SQLAlchemy metadata...")

# Option 1: Clear the metadata from Base
Base.metadata.clear()
print("✓ Cleared Base.metadata")

# Option 2: Reflect the actual database schema
print("Reflecting database schema...")
Base.metadata.reflect(bind=app_engine)
print("✓ Reflected database schema into metadata")

# Option 3: Create a fresh inspector to list columns
inspector = inspect(app_engine)
columns = inspector.get_columns('users')

print(f"\n✅ SQLAlchemy now sees {len(columns)} columns in users table:")
for col in columns:
    print(f"  - {col['name']}: {col['type']}")

# Verify GitHub columns
github_cols = ['github_id', 'github_username', 'github_access_token', 'github_refresh_token',
               'github_stars_total', 'github_repos_count', 'github_languages', 'github_bio',
               'github_avatar_url', 'github_profile_url', 'github_last_synced']
               
existing = {col['name'] for col in columns}
missing = [col for col in github_cols if col not in existing]

if missing:
    print(f"\n❌ Still missing: {missing}")
else:
    print(f"\n✅ All GitHub columns found by SQLAlchemy!")
