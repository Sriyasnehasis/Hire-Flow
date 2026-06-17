"""
Database Reset & Re-seeding Script
Drops all existing tables in PostgreSQL and recreates them based on updated models.
Then runs the seed script to create the default developer user (ID: 1).
"""
import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.core.db import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.job import JobListing
from app.models.resume import Resume
from app.models.application import JobApplication
from app.models.hr_contact import HRContact, EmailTemplate, EmailLog

from seed_user import seed_dev_user

def reset_database():
    print("Connecting to database: ", os.getenv("POSTGRES_URL").split("@")[-1]) # print host/db securely
    
    print("Dropping all existing tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped successfully.")
    except Exception as e:
        print(f"Error dropping tables: {e}")
        return False
        
    print("Creating all tables from updated models...")
    try:
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False
        
    print("Seeding developer user...")
    try:
        seed_dev_user()
        print("Database reset and seeding completed successfully!")
        return True
    except Exception as e:
        print(f"Error seeding user: {e}")
        return False

if __name__ == "__main__":
    reset_database()
