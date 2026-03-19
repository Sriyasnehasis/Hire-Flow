-- PostgreSQL initialization script for ExtractResume
-- This file is loaded automatically by docker-compose

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schema (optional, if using schemas)
-- CREATE SCHEMA app;

-- Tables will be auto-created by SQLAlchemy on first run
-- This script is mainly for reference and custom seed data if needed

-- Seed data (optional)
-- INSERT INTO users (email, password_hash, full_name, is_active)
-- VALUES ('demo@example.com', 'hashed_password', 'Demo User', true);
