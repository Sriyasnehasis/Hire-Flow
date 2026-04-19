import psycopg2

conn = psycopg2.connect(
    database="postgres",
    user="postgres",
    password="admin123",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Check what schema the users table is in
cursor.execute("""
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name = 'users'
""")

results = cursor.fetchall()
print(f"Found {len(results)} users table(s):")
for schema, table in results:
    print(f"  - Schema: {schema}, Table: {table}")

# Also check all schemas
cursor.execute("""
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name NOT LIKE 'pg_%'
""")

schemas = cursor.fetchall()
print(f"\nAll non-system schemas:")
for (schema,) in schemas:
    print(f"  - {schema}")

# Check columns for each users table
for schema, table in results:
    print(f"\nColumns in {schema}.{table}:")
    cursor.execute(f"""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position
        LIMIT 10
    """, (schema, table))
    
    cols = cursor.fetchall()
    for col_name, col_type in cols:
        print(f"  - {col_name}: {col_type}")
    print(f"  ... and {len(cols) - 10} more columns" if len(cols) > 10 else "")

cursor.close()
conn.close()
