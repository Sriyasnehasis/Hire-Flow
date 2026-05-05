from app.core.db import SessionLocal
from app.models.user import User
import datetime

def seed_dev_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            print("Creating development user (ID: 1)...")
            user = User(
                id=1,
                email="test@hireflow.ai",
                full_name="Candidate",
                hashed_password="dummy",
                is_active=True,
                resume_text="Senior Full Stack Engineer with expertise in React, Next.js, Node.js, and Python. Experience building scalable web applications and AI-driven platforms.",
                primary_skills=["React", "Next.js", "Node.js", "Python", "TypeScript", "FastAPI"],
                created_at=datetime.datetime.utcnow()
            )
            db.add(user)
            db.commit()
            print("User 1 created successfully.")
        else:
            if not user.resume_text:
                user.resume_text = "Senior Full Stack Engineer with expertise in React, Next.js, Node.js, and Python."
                user.primary_skills = ["React", "Next.js", "Node.js", "Python"]
                db.commit()
                print("User 1 resume updated.")
            print("User 1 already exists.")
    except Exception as e:
        print(f"Error seeding user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_dev_user()
