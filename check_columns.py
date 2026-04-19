from sqlalchemy import inspect, create_engine
import os
from dotenv import load_dotenv

load_dotenv()
postgres_url = os.getenv('POSTGRES_URL')
engine = create_engine(postgres_url)

inspector = inspect(engine)
columns = inspector.get_columns('users')
print('Users table columns:')
for col in columns:
    print(f'  {col["name"]}: {col["type"]}')
