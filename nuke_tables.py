import psycopg2

# Connect to PostgreSQL
conn = psycopg2.connect(
    database="postgres",
    user="postgres", 
    password="admin123",
    host="localhost",
    port="5432"
)

conn.autocommit = True
cursor = conn.cursor()

try:
    # Drop the users table completely
    cursor.execute("DROP TABLE IF EXISTS users CASCADE")
    print("✓ Dropped users table")
    
    # Drop other dependent tables too
    cursor.execute("DROP TABLE IF EXISTS resumes CASCADE")
    print("✓ Dropped resumes table")
    
    cursor.execute("DROP TABLE IF EXISTS job_applications CASCADE")
    print("✓ Dropped job_applications table")
    
    cursor.execute("DROP TABLE IF EXISTS job_listings CASCADE")
    print("✓ Dropped job_listings table")
    
    cursor.execute("DROP TABLE IF EXISTS hr_contacts CASCADE")
    print("✓ Dropped hr_contacts table")
    
    print("\n✅ All tables dropped. Backend will recreate them on next startup")
    
except Exception as e:
    print(f"❌ Error: {e}")
    
finally:
    cursor.close()
    conn.close()
