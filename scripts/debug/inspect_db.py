import sys
sys.path.insert(0, 'backend')

from sqlalchemy import inspect, create_engine
from app.core.config import settings

# Connect to database
engine = create_engine(settings.POSTGRES_URL)

# Inspect the users table
inspector = inspect(engine)
columns = inspector.get_columns('users')

print(f"\n{'Column Name':<30} {'Type':<20}")
print("-" * 50)
for col in columns:
    col_type = str(col['type'])
    print(f"{col['name']:<30} {col_type:<20}")
    
print(f"\nTotal columns: {len(columns)}")

# Check which GitHub columns are missing
github_cols = [
    'github_id', 'github_username', 'github_access_token', 'github_refresh_token',
    'github_stars_total', 'github_repos_count', 'github_languages', 'github_bio',
    'github_avatar_url', 'github_profile_url', 'github_last_synced'
]

existing_cols = {col['name'] for col in columns}
missing = [col for col in github_cols if col not in existing_cols]

if missing:
    print(f"\n❌ MISSING columns: {missing}")
else:
    print(f"\n✅ All GitHub columns exist!")
