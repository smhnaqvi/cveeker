# Docker Setup with PostgreSQL

This guide will help you run the entire Cvilo application stack using Docker Compose with PostgreSQL.

## 🚀 Quick Start

### Single Command Setup

```bash
# Start all services
./start-cvilo.sh

# Or manually
docker-compose up --build -d
```

### Manual Setup

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📋 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **PostgreSQL** | 5432 | Database |
| **pgAdmin** | 5050 | Database management UI |
| **API** | 8081 | Go API backend |
| **Client Dashboard** | 3009 | React frontend |
| **Landing Page** | 3001 | Next.js landing |
| **Nginx** | 80 | Reverse proxy |

## 🔧 Configuration

### Environment Variables

The API service uses these environment variables:

```env
# PostgreSQL Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=cvilo_password
POSTGRES_DB=cvilo_db
POSTGRES_SSLMODE=disable

# API Configuration
GIN_MODE=release
HOST=0.0.0.0
PORT=8081
```

### Database Access

- **Host**: `postgres` (internal Docker network)
- **Port**: `5432`
- **Database**: `cvilo_db`
- **Username**: `postgres`
- **Password**: `cvilo_password`

## 🌐 Access Points

### Development URLs

- **Main Site**: http://localhost
- **API**: http://localhost:8081
- **Client Dashboard**: http://localhost:3009
- **Landing Page**: http://localhost:3001
- **pgAdmin**: http://localhost:5050

### pgAdmin Access

- **Email**: admin@cvilo.com
- **Password**: admin123

## 📊 Management Commands

### Service Management

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d cvilo-api

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart
```

### Monitoring

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f cvilo-api

# Check resource usage
docker stats
```

### Database Management

```bash
# Access PostgreSQL directly
docker-compose exec postgres psql -U postgres -d cvilo_db

# Backup database
docker-compose exec postgres pg_dump -U postgres cvilo_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d cvilo_db < backup.sql
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8081
   
   # Stop conflicting service
   docker-compose down
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL logs
   docker-compose logs postgres
   
   # Restart PostgreSQL
   docker-compose restart postgres
   ```

3. **API Not Starting**
   ```bash
   # Check API logs
   docker-compose logs cvilo-api
   
   # Rebuild API
   docker-compose up --build cvilo-api
   ```

### Health Checks

```bash
# Check API health
curl http://localhost:8081/ping

# Check PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Check all services
docker-compose ps
```

## 🗄️ Data Persistence

### Volumes

The following data is persisted:

- **PostgreSQL Data**: `postgres_data` volume
- **pgAdmin Data**: `pgadmin_data` volume
- **Application Data**: `app-data` volume

### Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U postgres cvilo_db > backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"
EOF

chmod +x backup.sh
```

## 🔄 Development Workflow

### Local Development

1. **Start the stack**:
   ```bash
   docker-compose up -d
   ```

2. **Make code changes** (files are mounted as volumes)

3. **Restart specific service**:
   ```bash
   docker-compose restart cvilo-api
   ```

4. **View logs**:
   ```bash
   docker-compose logs -f cvilo-api
   ```

### Database Migrations

The API automatically runs migrations on startup. If you need to run migrations manually:

```bash
# Access the API container
docker-compose exec cvilo-api sh

# Run migrations
./cvilo-api
```

## 🚀 Production Considerations

### Environment Variables

For production, update the environment variables:

```env
# Production PostgreSQL
POSTGRES_HOST=your-production-host
POSTGRES_PASSWORD=your-secure-password
POSTGRES_SSLMODE=require

# Production API
GIN_MODE=release
```

### Security

1. **Change default passwords**
2. **Use SSL for database connections**
3. **Restrict network access**
4. **Regular backups**

### Scaling

```bash
# Scale API instances
docker-compose up -d --scale cvilo-api=3

# Scale with load balancer
docker-compose up -d --scale cvilo-api=5
```

## 📁 File Structure

```
cveeker/
├── docker-compose.yml          # Main compose file
├── start-cvilo.sh             # Startup script
├── cvilo-api/
│   ├── Dockerfile             # API container
│   ├── .env                   # API environment
│   └── wait-for-postgres.sh   # Database wait script
├── cvilo-clientarea/
│   └── Dockerfile             # Frontend container
├── cvilo-landing-nextjs/
│   └── Dockerfile             # Landing container
└── nginx/
    └── nginx.dev.conf         # Nginx configuration
```

## 🎯 Benefits

- **Single Command Setup**: Start everything with `./start-cvilo.sh`
- **Isolated Environment**: Each service runs in its own container
- **Easy Scaling**: Scale individual services independently
- **Persistent Data**: Database data survives container restarts
- **Development Friendly**: Hot reloading with volume mounts
- **Production Ready**: Can be deployed to any Docker environment 