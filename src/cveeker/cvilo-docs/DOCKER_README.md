# CVilo Monorepo Docker Setup

This document explains how to run the CVilo monorepo using Docker and Docker Compose.

## Architecture Overview

The monorepo consists of the following services:

- **cvilo-api** (Go): Main API service running on port 8081
- **cvilo-export** (Go): PDF export service running on port 8082
- **cvilo-clientarea** (React/Vite): Client dashboard running on port 3009
- **cvilo-landing** (React/Vite): Landing page running on port 3000
- **cvilo-landing-nextjs** (Next.js): Alternative landing page running on port 3001
- **nginx**: Reverse proxy running on port 80/443

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Clone the repository and navigate to the root directory:**
   ```bash
   cd /path/to/cveeker
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the services:**
   - Main landing page: http://localhost
   - Client dashboard: http://localhost/dashboard
   - API documentation: http://localhost/api/docs
   - Health check: http://localhost/health

## Service Details

### API Service (cvilo-api)
- **Port**: 8081
- **Technology**: Go with Gin framework
- **Database**: SQLite (embedded)
- **Features**: User management, resume CRUD, LinkedIn OAuth, AI integration

### Export Service (cvilo-export)
- **Port**: 8082
- **Technology**: Go with Chrome headless for PDF generation
- **Features**: Resume to PDF conversion

### Client Dashboard (cvilo-clientarea)
- **Port**: 3009
- **Technology**: React with Vite
- **Features**: User dashboard for resume management

### Landing Pages
- **cvilo-landing**: React/Vite landing page (port 3000)
- **cvilo-landing-nextjs**: Next.js landing page (port 3001, default)

### Nginx Reverse Proxy
- **Port**: 80 (HTTP), 443 (HTTPS)
- **Features**: Load balancing, rate limiting, SSL termination

## Environment Variables

### API Service
```bash
PORT=8081
GIN_MODE=release
# Add your API keys and database configuration
```

### Export Service
```bash
PORT=8082
CHROME_BIN=/usr/bin/chromium-browser
```

### Frontend Services
```bash
VITE_API_URL=http://cvilo-api:8081
VITE_EXPORT_URL=http://cvilo-export:8082
NEXT_PUBLIC_API_URL=http://cvilo-api:8081
```

## Development Workflow

### Running in Development Mode
```bash
# Start services with volume mounts for hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Building Individual Services
```bash
# Build specific service
docker-compose build cvilo-api

# Build and run specific service
docker-compose up --build cvilo-api
```

### Viewing Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs cvilo-api

# Follow logs in real-time
docker-compose logs -f cvilo-api
```

### Accessing Containers
```bash
# Access API container
docker-compose exec cvilo-api sh

# Access client dashboard container
docker-compose exec cvilo-clientarea sh
```

## Production Deployment

### 1. Environment Configuration
Create `.env` files for each service with production values:

```bash
# cvilo-api/.env
DATABASE_URL=your_production_db_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 2. SSL Configuration
1. Place SSL certificates in `nginx/ssl/`
2. Uncomment HTTPS server block in `nginx/nginx.conf`
3. Update domain names in nginx configuration

### 3. Database Setup
For production, consider using PostgreSQL or MySQL instead of SQLite:

```yaml
# Add to docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cvilo
      POSTGRES_USER: cvilo_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cvilo-network
```

### 4. Scaling
```bash
# Scale API service
docker-compose up --scale cvilo-api=3

# Scale export service
docker-compose up --scale cvilo-export=2
```

## Monitoring and Health Checks

### Health Check Endpoints
- API: `http://localhost/api/ping`
- Export: `http://localhost/export/health`
- Nginx: `http://localhost/health`

### Monitoring with Docker
```bash
# View resource usage
docker stats

# View service status
docker-compose ps

# Check service health
docker-compose exec cvilo-api wget -qO- http://localhost:8081/ping
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 8081, 8082, 3000, 3001, 3009 are available
2. **Permission issues**: Run `sudo chown -R $USER:$USER .` in the project directory
3. **Memory issues**: Increase Docker memory limit in Docker Desktop settings
4. **Chrome/PDF issues**: Ensure the export service has sufficient memory for Chrome

### Debug Commands
```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs --tail=100 cvilo-api

# Restart specific service
docker-compose restart cvilo-api

# Rebuild and restart
docker-compose up --build --force-recreate cvilo-api
```

### Database Issues
```bash
# Access SQLite database
docker-compose exec cvilo-api sqlite3 /app/cvilo.db

# Reset database
docker-compose exec cvilo-api rm /app/cvilo.db
docker-compose restart cvilo-api
```

## Performance Optimization

### Build Optimization
- Use multi-stage builds (already implemented)
- Leverage Docker layer caching
- Use `.dockerignore` files (already implemented)

### Runtime Optimization
- Use Alpine Linux base images (already implemented)
- Implement proper health checks (already implemented)
- Use non-root users (already implemented)

### Network Optimization
- Use Docker networks for service communication
- Implement proper rate limiting
- Use nginx for load balancing

## Security Considerations

### Implemented Security Features
- Non-root users in containers
- Security headers in nginx
- Rate limiting on API endpoints
- CORS configuration
- Input validation

### Additional Security Recommendations
1. Use secrets management for sensitive data
2. Implement proper authentication and authorization
3. Regular security updates for base images
4. Network segmentation
5. SSL/TLS encryption in production

## Backup and Recovery

### Database Backup
```bash
# Backup SQLite database
docker-compose exec cvilo-api sqlite3 /app/cvilo.db ".backup '/app/backup.db'"

# Restore database
docker-compose exec cvilo-api sqlite3 /app/cvilo.db ".restore '/app/backup.db'"
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v cvilo_app-data:/data -v $(pwd):/backup alpine tar czf /backup/app-data-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v cvilo_app-data:/data -v $(pwd):/backup alpine tar xzf /backup/app-data-backup.tar.gz -C /data
```

## Contributing

When adding new services or modifying existing ones:

1. Update `docker-compose.yml` with new service configuration
2. Create appropriate Dockerfile for the service
3. Add `.dockerignore` file
4. Update nginx configuration if needed
5. Update this documentation

## Support

For issues related to Docker setup:
1. Check the troubleshooting section above
2. Review Docker and docker-compose logs
3. Ensure all prerequisites are met
4. Verify environment variables are correctly set 