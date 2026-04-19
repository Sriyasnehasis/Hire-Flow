from app.core.db import SessionLocal
from app.models.user import User

db = SessionLocal()
users = db.query(User).all()
print(f"Total users in database: {len(users)}")
for user in users:
    print(f"  - {user.email}")
db.close()
