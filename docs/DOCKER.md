# 🐳 Docker & Docker Compose Guide

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## Quick Start with Docker Compose

### Step 1: Setup Environment

```bash
cd /path/to/ExtractResume-Ecosystem

# Create .env file from example
cp .env.example .env

# Create backend env from example
cp backend/.env.example backend/.env

# Create frontend env from example
cp frontend/.env.example frontend/.env
```

### Step 2: Update Environment Variables

Edit `.env` and customize:

```env
POSTGRES_PASSWORD=your-secure-password
MONGO_PASSWORD=your-secure-password
SECRET_KEY=your-secure-secret-key-min-32-chars
OPENAI_API_KEY=your-openai-key  (if using AI features)
```

### Step 3: Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Step 4: Access Services

After containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Step 5: Verify Setup

```bash
# Check all containers are running
docker-compose ps

# Test backend health
curl http://localhost:8000/

# Test frontend
curl http://localhost:3000/
```

---

## Common Docker Commands

### Container Management

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Execute command in container
docker-compose exec backend python -m pytest

# Rebuild images
docker-compose up --build
```

### Database Management

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U extractresume_user -d extractresume_db

# Backup database
docker-compose exec postgres pg_dump -U extractresume_user extractresume_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U extractresume_user extractresume_db < backup.sql

# Access MongoDB
docker-compose exec mongodb mongosh
```

### Troubleshooting

```bash
# View container logs
docker-compose logs backend

# Rebuild specific service
docker-compose build backend --no-cache

# Remove all containers and volumes
docker-compose down -v

# Check service health
docker-compose exec backend curl http://localhost:8000/

# Restart services
docker-compose restart
```

---

## Building Individual Containers

### Backend

```bash
# Build backend image
docker build -t extractresume-backend:latest ./backend

# Run backend container
docker run -p 8000:8000 \
  -e POSTGRES_URL=postgresql://user:pass@host/db \
  extractresume-backend:latest
```

### Frontend

```bash
# Build frontend image
docker build -t extractresume-frontend:latest ./frontend

# Run frontend container
docker run -p 3000:3000 extractresume-frontend:latest
```

---

## Production Considerations

### 1. Security

```yaml
# In docker-compose.yml for production:
services:
  backend:
    environment:
      DEBUG: False # Disable debug mode
      CORS_ORIGINS: "https://yourdomain.com" # Restrict CORS
```

### 2. Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
```

### 3. Health Checks

All services have health checks defined. Monitor via:

```bash
docker-compose ps  # Check health status
```

### 4. Persistent Data

Data is stored in Docker volumes:

- `postgres_data` - PostgreSQL database
- `mongodb_data` - MongoDB data
- `redis_data` - Redis data

Backup volumes:

```bash
docker run --rm -v postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data
```

---

## Using Docker in Development

### Auto-reload with Volumes

The docker-compose.yml uses volume mounts for development:

```yaml
backend:
  volumes:
    - ./backend:/app # Code changes auto-reload
```

### Executing Development Commands

```bash
# Run tests
docker-compose exec backend pytest

# Run migrations
docker-compose exec backend alembic upgrade head

# Create database tables
docker-compose exec backend python -c "from app.models import *; Base.metadata.create_all(bind=engine)"

# Run shell
docker-compose exec backend python
```

---

## Cleanup

```bash
# Remove all unused Docker resources
docker system prune -a

# Remove specific images
docker rmi extractresume-backend

# Remove containers
docker rm container_id
```

---

## Next Steps

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to production
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
