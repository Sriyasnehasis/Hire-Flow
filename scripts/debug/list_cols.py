import psycopg2

conn = psycopg2.connect(
    database="postgres",
    user="postgres",
    password="admin123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Get all columns
cursor.execute("""
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
    ORDER BY ordinal_position
""")

cols = [r[0] for r in cursor.fetchall()]

print("All columns in public.users:")
for i, col in enumerate(cols, 1):
    print(f"{i:2}. {col}")

print(f"\nTotal: {len(cols)} columns")

# Check if github_username exists
if 'github_username' in cols:
    print("\n✅ github_username EXISTS!")
else:
    print("\n❌ github_username NOT FOUND!")

cursor.close()
conn.close()
