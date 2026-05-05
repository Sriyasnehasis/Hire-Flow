import psycopg2
from psycopg2 import sql

# Connect to PostgreSQL directly
try:
    conn = psycopg2.connect(
        database="postgres",
        user="postgres",
        password="admin123",
        host="localhost",
        port="5432"
    )
    
    cursor = conn.cursor()
    
    # Get all columns in the users table
    cursor.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
    """)
    
    print(f"\n{'Column Name':<30} {'Data Type':<20}")
    print("-" * 50)
    
    columns = cursor.fetchall()
    for col_name, col_type in columns:
        print(f"{col_name:<30} {col_type:<20}")
    
    print(f"\nTotal columns: {len(columns)}")
    
    # Check GitHub columns exist
    github_cols = [
        'github_id', 'github_username', 'github_access_token', 'github_refresh_token',
        'github_stars_total', 'github_repos_count', 'github_languages', 'github_bio',
        'github_avatar_url', 'github_profile_url', 'github_last_synced'
    ]
    
    existing = {col[0] for col in columns}
    missing = [col for col in github_cols if col not in existing]
    
    if missing:
        print(f"\n❌ MISSING: {missing}")
    else:
        print(f"\n✅ All GitHub columns present!")
        
    # Also check for github_url
    if 'github_url' in existing:
        print("✅ github_url also present")
    else:
        print("❌ github_url MISSING")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
