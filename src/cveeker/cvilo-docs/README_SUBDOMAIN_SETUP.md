# CVilo Subdomain Architecture

## Overview

New subdomain-based architecture for better security, scalability, and maintenance:

- **cvilo.com** → Landing page (Next.js)
- **api.cvilo.com** → API service (Go)  
- **app.cvilo.com** → Client dashboard (React)

## Quick Start

### 1. Deploy Services
```bash
./deploy-subdomains.sh
```

### 2. Configure DNS in Cloudflare
- `cvilo.com` → YOUR_SERVER_IP
- `api.cvilo.com` → YOUR_SERVER_IP  
- `app.cvilo.com` → YOUR_SERVER_IP

### 3. Test Setup
```bash
./test-subdomains.sh
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   cvilo.com     │    │  api.cvilo.com  │    │  app.cvilo.com  │
│                 │    │                 │    │                 │
│  Landing Page   │    │   API Service   │    │ Client Dashboard│
│   (Next.js)     │    │     (Go)        │    │    (React)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Nginx Proxy   │
                    │   (Port 80/443) │
                    └─────────────────┘
```

## Benefits

- **Security**: API isolation, better CORS management
- **Scalability**: Independent service scaling
- **Maintenance**: Isolated deployments and debugging
- **Performance**: Service-specific optimizations

## Configuration Files

- [docker-compose.yml](docker-compose.yml) - Service definitions
- [nginx/nginx.conf](nginx/nginx.conf) - Reverse proxy config
- [CLOUDFLARE_SUBDOMAIN_SETUP.md](CLOUDFLARE_SUBDOMAIN_SETUP.md) - DNS setup guide

## Commands

```bash
# Deploy all services
./deploy-subdomains.sh

# Stop services
./deploy-subdomains.sh stop

# Check status
./deploy-subdomains.sh status

# Run tests
./deploy-subdomains.sh test

# View logs
./deploy-subdomains.sh logs
```

## Health Checks

- Landing page: `https://cvilo.com/health`
- API: `https://api.cvilo.com/health`
- App: `https://app.cvilo.com/health`

## Troubleshooting

1. Check DNS resolution: `dig api.cvilo.com`
2. Test SSL: `openssl s_client -connect api.cvilo.com:443`
3. Check service logs: `docker-compose logs [service]`
4. Run test script: `./test-subdomains.sh`

See [CLOUDFLARE_SUBDOMAIN_SETUP.md](CLOUDFLARE_SUBDOMAIN_SETUP.md) for detailed configuration instructions. 