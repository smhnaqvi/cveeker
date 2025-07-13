# Domain Setup Guide for cvilo.com

This guide will help you configure your cvilo.com domain to work with the Docker setup.

## 🚀 Quick Start

### 1. DNS Configuration

First, configure your domain's DNS settings to point to your server:

```bash
# A Record
cvilo.com     →  YOUR_SERVER_IP
www.cvilo.com →  YOUR_SERVER_IP

# CNAME Record (alternative)
www.cvilo.com →  cvilo.com
```

### 2. SSL Certificate Setup

Choose one of the following methods:

#### Option A: Let's Encrypt (Recommended - Free)
```bash
# Generate free SSL certificate
./setup-ssl.sh lets-encrypt

# Follow the instructions to get your certificate
sudo certbot certonly --standalone -d cvilo.com -d www.cvilo.com

# Copy certificates to nginx/ssl/
sudo cp /etc/letsencrypt/live/cvilo.com/fullchain.pem nginx/ssl/cvilo.com.crt
sudo cp /etc/letsencrypt/live/cvilo.com/privkey.pem nginx/ssl/cvilo.com.key

# Set permissions
sudo chown -R $USER:$USER nginx/ssl/
chmod 600 nginx/ssl/cvilo.com.key
chmod 644 nginx/ssl/cvilo.com.crt
```

#### Option B: Self-Signed (Testing Only)
```bash
# Generate self-signed certificate for testing
./setup-ssl.sh self-signed
```

#### Option C: Commercial SSL
```bash
# Follow instructions for commercial SSL
./setup-ssl.sh commercial
```

### 3. Start Services

```bash
# Start all services
./docker-scripts.sh start-prod

# Check status
./docker-scripts.sh status
```

### 4. Test Your Domain

Visit these URLs to test your setup:
- **Main Site**: https://cvilo.com
- **Dashboard**: https://cvilo.com/dashboard
- **API Docs**: https://cvilo.com/api/docs
- **Health Check**: https://cvilo.com/health

## 🔧 Detailed Configuration

### DNS Records

Configure these DNS records with your domain provider:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | cvilo.com | YOUR_SERVER_IP | 300 |
| A | www.cvilo.com | YOUR_SERVER_IP | 300 |
| CNAME | www | cvilo.com | 300 |

### SSL Certificate Renewal (Let's Encrypt)

For Let's Encrypt certificates, set up automatic renewal:

```bash
# Create renewal script
cat > renew-ssl.sh << 'EOF'
#!/bin/bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/cvilo.com/fullchain.pem nginx/ssl/cvilo.com.crt
sudo cp /etc/letsencrypt/live/cvilo.com/privkey.pem nginx/ssl/cvilo.com.key
sudo chown -R $USER:$USER nginx/ssl/
chmod 600 nginx/ssl/cvilo.com.key
chmod 644 nginx/ssl/cvilo.com.crt
docker-compose restart nginx
EOF

chmod +x renew-ssl.sh

# Add to crontab for automatic renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /path/to/your/project/renew-ssl.sh") | crontab -
```

### Environment Variables

Update your environment variables for production:

```bash
# cvilo-api/.env
DATABASE_URL=your_production_db_url
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
DOMAIN=cvilo.com
```

### Firewall Configuration

Ensure your server allows these ports:

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow Docker ports (if needed)
sudo ufw allow 8081
sudo ufw allow 8082
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw allow 3009
```

## 🌐 Domain-Specific Features

### Custom Domain for Each Service

You can set up subdomains for different services:

```nginx
# Add to nginx/nginx.conf
server {
    listen 443 ssl http2;
    server_name api.cvilo.com;
    
    ssl_certificate /etc/nginx/ssl/cvilo.com.crt;
    ssl_certificate_key /etc/nginx/ssl/cvilo.com.key;
    
    location / {
        proxy_pass http://api_backend;
        # ... other proxy settings
    }
}

server {
    listen 443 ssl http2;
    server_name dashboard.cvilo.com;
    
    ssl_certificate /etc/nginx/ssl/cvilo.com.crt;
    ssl_certificate_key /etc/nginx/ssl/cvilo.com.key;
    
    location / {
        proxy_pass http://clientarea_backend;
        # ... other proxy settings
    }
}
```

### Email Configuration

Set up email for your domain:

```bash
# Add MX records for email
cvilo.com MX 10 mail.cvilo.com

# Add SPF record
cvilo.com TXT "v=spf1 include:_spf.google.com ~all"

# Add DKIM record (if using email service)
cvilo.com TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_KEY"
```

## 🔍 Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   ```bash
   # Test SSL certificate
   ./setup-ssl.sh test
   
   # Check nginx configuration
   docker-compose exec nginx nginx -t
   ```

2. **DNS Propagation**
   ```bash
   # Check DNS propagation
   dig cvilo.com
   nslookup cvilo.com
   ```

3. **Port Issues**
   ```bash
   # Check if ports are open
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

4. **Service Issues**
   ```bash
   # Check service logs
   ./docker-scripts.sh logs nginx
   ./docker-scripts.sh logs cvilo-api
   ```

### SSL Certificate Problems

```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cvilo.com.crt -text -noout

# Test SSL connection
openssl s_client -connect cvilo.com:443 -servername cvilo.com

# Check certificate expiration
openssl x509 -in nginx/ssl/cvilo.com.crt -noout -dates
```

### Performance Optimization

1. **Enable HTTP/2**
   - Already configured in nginx.conf

2. **Enable Gzip Compression**
   - Already configured in nginx.conf

3. **Set up CDN**
   ```bash
   # Add Cloudflare or similar CDN
   # Update DNS to use CDN nameservers
   ```

## 📊 Monitoring

### Health Checks

```bash
# Check service health
curl -k https://cvilo.com/health

# Check API health
curl -k https://cvilo.com/api/ping

# Check nginx status
curl -k https://cvilo.com/status
```

### SSL Monitoring

```bash
# Monitor SSL certificate expiration
echo "SSL Certificate Expiration:"
openssl x509 -in nginx/ssl/cvilo.com.crt -noout -enddate

# Set up monitoring alerts
# Add to your monitoring system
```

## 🔒 Security

### Security Headers

Already configured in nginx:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

### Rate Limiting

Already configured:
- API: 10 requests/second
- Export: 5 requests/second

### Additional Security

```bash
# Set up fail2ban
sudo apt-get install fail2ban

# Configure fail2ban for nginx
sudo nano /etc/fail2ban/jail.local
```

## 🚀 Deployment Checklist

- [ ] DNS records configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Environment variables set
- [ ] Services started
- [ ] Health checks passing
- [ ] SSL certificate valid
- [ ] Domain accessible
- [ ] Monitoring configured
- [ ] Backup strategy in place

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker and nginx logs
3. Verify DNS propagation
4. Test SSL certificate validity
5. Check firewall settings

For additional help, refer to the main `DOCKER_README.md` file. 