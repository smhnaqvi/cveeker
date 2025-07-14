# Cloudflare Subdomain Setup Guide

This guide will help you configure Cloudflare to work with the new subdomain structure:

- `cvilo.com` → Landing page (Next.js)
- `api.cvilo.com` → API service (Go)
- `app.cvilo.com` → Client dashboard (React)

## DNS Configuration

### 1. Main Domain Records

In your Cloudflare DNS settings for `cvilo.com`, add these A records:

```
Type: A
Name: @ (or leave blank for root domain)
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A  
Name: www
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 2. API Subdomain

```
Type: A
Name: api
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 3. App Subdomain

```
Type: A
Name: app
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto
```

## SSL/TLS Configuration

### 1. SSL/TLS Mode
Set SSL/TLS encryption mode to **"Full (strict)"** for all subdomains.

### 2. Edge Certificates
Enable "Always Use HTTPS" for all subdomains.

### 3. Origin Server
Make sure your origin server (nginx) is configured with valid SSL certificates.

## Page Rules (Optional)

### 1. API Rate Limiting
Create a page rule for `api.cvilo.com/*`:
- Security Level: High
- Rate Limiting: Custom rules as needed

### 2. App Security
Create a page rule for `app.cvilo.com/*`:
- Security Level: Medium
- Browser Integrity Check: On

### 3. Landing Page Performance
Create a page rule for `cvilo.com/*`:
- Cache Level: Cache Everything
- Edge Cache TTL: 4 hours

## Security Settings

### 1. Security Level
- `cvilo.com`: Medium
- `api.cvilo.com`: High
- `app.cvilo.com`: Medium

### 2. WAF (Web Application Firewall)
Enable WAF for all subdomains with appropriate rules:
- API endpoints: Strict rules
- App dashboard: Standard rules
- Landing page: Basic protection

### 3. Bot Management
Enable bot management for:
- `api.cvilo.com` (strict)
- `app.cvilo.com` (standard)

## Performance Settings

### 1. Caching
- `cvilo.com`: Aggressive caching for static assets
- `api.cvilo.com`: No caching (API responses)
- `app.cvilo.com`: Standard caching

### 2. Minification
Enable for `cvilo.com` and `app.cvilo.com`:
- JavaScript
- CSS
- HTML

### 3. Brotli Compression
Enable for all subdomains.

## Firewall Rules

### 1. API Protection
```
Rule: API Rate Limiting
Expression: (http.request.uri.path contains "/api/") and (ip.src ne 127.0.0.1)
Action: Challenge (Captcha)
```

### 2. Geographic Restrictions (if needed)
```
Rule: Block Specific Countries
Expression: (ip.geoip.country eq "XX")
Action: Block
```

## Health Checks

Set up health checks for each subdomain:

### 1. API Health Check
- URL: `https://api.cvilo.com/health`
- Expected Status: 200
- Interval: 30 seconds

### 2. App Health Check
- URL: `https://app.cvilo.com/health`
- Expected Status: 200
- Interval: 30 seconds

### 3. Landing Page Health Check
- URL: `https://cvilo.com/health`
- Expected Status: 200
- Interval: 30 seconds

## Monitoring

### 1. Analytics
Enable analytics for all subdomains to track:
- Traffic patterns
- Error rates
- Performance metrics

### 2. Alerts
Set up alerts for:
- High error rates
- Down services
- Unusual traffic patterns

## Testing

After configuration, test each subdomain:

1. **Landing Page**: `https://cvilo.com`
2. **API**: `https://api.cvilo.com/health`
3. **App**: `https://app.cvilo.com`

## Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Ensure origin server has valid certificates
   - Check SSL/TLS mode is set to "Full (strict)"

2. **DNS Propagation**
   - DNS changes can take up to 24 hours
   - Use `dig` or `nslookup` to verify propagation

3. **CORS Issues**
   - Ensure API CORS settings match the new subdomain
   - Check that `app.cvilo.com` is in the allowed origins

4. **Rate Limiting**
   - Monitor API rate limits
   - Adjust Cloudflare rules if needed

### Verification Commands

```bash
# Check DNS resolution
dig api.cvilo.com
dig app.cvilo.com
dig cvilo.com

# Test SSL certificates
openssl s_client -connect api.cvilo.com:443 -servername api.cvilo.com
openssl s_client -connect app.cvilo.com:443 -servername app.cvilo.com
openssl s_client -connect cvilo.com:443 -servername cvilo.com

# Test health endpoints
curl -I https://api.cvilo.com/health
curl -I https://app.cvilo.com/health
curl -I https://cvilo.com/health
```

## Security Checklist

- [ ] SSL certificates are valid and properly configured
- [ ] DNS records are pointing to correct IP addresses
- [ ] Cloudflare proxy is enabled (orange cloud)
- [ ] Security levels are appropriately set
- [ ] WAF rules are configured
- [ ] Rate limiting is in place for API
- [ ] Health checks are monitoring all services
- [ ] Analytics and monitoring are enabled
- [ ] Backup and recovery procedures are documented 