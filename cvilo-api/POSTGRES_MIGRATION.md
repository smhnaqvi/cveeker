# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for the Cvilo API.

## Overview

The setup includes:
- ✅ PostgreSQL driver integration
- ✅ PostgreSQL-only database support
- ✅ Environment-based configuration
- ✅ Docker setup for PostgreSQL

## Quick Start

### 1. Setup PostgreSQL with Docker

```bash
# Run the setup script
./setup-postgres.sh
```

This will:
- Start PostgreSQL container
- Create `.env` file with PostgreSQL configuration
- Install Go dependencies
- Run initial migrations

### 2. Start the API

```bash
go run main.go
```

## Manual Setup

### 1. Install PostgreSQL

#### Option A: Docker (Recommended)
```bash
docker-compose -f docker-compose.postgres.yml up -d postgres
```

#### Option B: Local Installation
- Install PostgreSQL on your system
- Create database: `cvilo_db`
- Create user: `postgres` with password: `cvilo_password`

### 2. Configure Environment

Create `.env` file:
```env
# PostgreSQL Configuration
USE_POSTGRES=true

# PostgreSQL Connection Details
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=cvilo_password
POSTGRES_DB=cvilo_db
POSTGRES_SSLMODE=disable

# Data Migration (set to true to migrate data from SQLite to PostgreSQL)
MIGRATE_DATA=false

# Keep SQLite connection for migration (optional)
SQL_CONNECTION=./cvilo.db
```

### 3. Install Dependencies

```bash
go mod tidy
```

### 4. Run Migrations

```bash
go run main.go
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | - |
| `POSTGRES_DB` | PostgreSQL database name | `cvilo_db` |
| `POSTGRES_SSLMODE` | SSL mode | `disable` |

## Database Schema

The migration supports all existing models:
- `UserModel` - User accounts and profiles
- `ResumeModel` - Resume/CV data
- `LinkedInAuthModel` - LinkedIn OAuth data
- `ChatPromptHistory` - AI chat history

## Database Setup

### Schema Migration

The application will automatically create the required tables:
- `users` - User accounts and profiles
- `resumes` - Resume/CV data
- `linkedin_auth` - LinkedIn OAuth data
- `chat_prompt_history` - AI chat history

### Running Migrations

```bash
# Start the application (migrations run automatically)
go run main.go
```

## Troubleshooting

### Connection Issues

1. **PostgreSQL not running**
   ```bash
   # Check if container is running
   docker ps | grep postgres
   
   # Start container if needed
   docker-compose -f docker-compose.postgres.yml up -d postgres
   ```

2. **Wrong credentials**
   - Check `.env` file
   - Verify PostgreSQL user/password
   - Test connection manually

3. **Database doesn't exist**
   ```sql
   CREATE DATABASE cvilo_db;
   ```

### Database Issues

1. **Data already exists**
   - Clear PostgreSQL tables first
   - Or use different database name

2. **Foreign key constraints**
   - GORM handles relationships automatically
   - All constraints are properly set up

### Performance

- PostgreSQL is generally faster for concurrent users
- Better support for complex queries
- Improved data integrity with constraints

## Database Management

### Backup and Restore

```bash
# Backup database
pg_dump -h localhost -U postgres cvilo_db > backup.sql

# Restore database
psql -h localhost -U postgres cvilo_db < backup.sql
```

## Development

### Local Development

```bash
# Start PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

# Run with hot reload
go run main.go

# Access pgAdmin (optional)
# http://localhost:5050
# admin@cvilo.com / admin123
```

### Testing

```bash
# Test PostgreSQL connection
go run main.go

# Check health endpoint
curl http://localhost:8081/ping
```

## Production Deployment

1. **Use managed PostgreSQL** (AWS RDS, Google Cloud SQL, etc.)
2. **Set proper SSL mode** (`require` or `verify-full`)
3. **Use connection pooling** for better performance
4. **Backup strategy** for data protection

## Files Changed

- `go.mod` - Added PostgreSQL driver, removed SQLite
- `database/postgres.go` - PostgreSQL connection
- `database/manager.go` - PostgreSQL-only database support
- `migration/migration.go` - Updated for PostgreSQL
- `main.go` - Updated for PostgreSQL
- `models/*.go` - Updated all models to use PostgreSQL
- `docker-compose.postgres.yml` - PostgreSQL setup
- `setup-postgres.sh` - Automated setup script

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify environment variables
3. Test database connection manually
4. Check application logs for errors 