# Cloudflare Setup Guide for cvilo.com

This guide will help you configure Cloudflare to work with your cvilo.com domain and Docker setup.

## 🚀 Quick Setup Steps

### 1. Add Domain to Cloudflare

1. Log into your Cloudflare account
2. Click "Add a Site"
3. Enter `cvilo.com`
4. Select the Free plan (or higher if needed)
5. Cloudflare will scan your existing DNS records

### 2. Update Nameservers

Cloudflare will provide you with 2 nameservers. Update your domain registrar's nameservers to:

```
nina.ns.cloudflare.com
rick.ns.cloudflare.com
```

**Note**: The actual nameservers will be provided by Cloudflare - use the ones they give you.

### 3. Configure DNS Records

In Cloudflare DNS settings, configure these records:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | cvilo.com | YOUR_SERVER_IP | Proxied (Orange Cloud) | Auto |
| A | www.cvilo.com | YOUR_SERVER_IP | Proxied (Orange Cloud) | Auto |

**Important**: 
- Replace `YOUR_SERVER_IP` with your actual server IP address
- Make sure the orange cloud is enabled (Proxied) for both records
- This ensures traffic goes through Cloudflare's CDN

### 4. SSL/TLS Configuration

Go to **SSL/TLS** section in Cloudflare:

1. **SSL/TLS encryption mode**: Set to "Full (strict)"
2. **Edge Certificates**: 
   - Enable "Always Use HTTPS"
   - Enable "Minimum TLS Version" and set to 1.2
3. **HSTS**: Enable with these settings:
   - Max Age: 31536000 (1 year)
   - Apply HSTS policy to subdomains: Enabled
   - Preload: Enabled

### 5. Security Settings

In **Security** section:

1. **Security Level**: Set to "Medium"
2. **Browser Integrity Check**: Enable
3. **Challenge Passage**: Set to 30 minutes
4. **Security Events**: Enable logging

### 6. Performance Settings

In **Speed** section:

1. **Auto Minify**: Enable for JS, CSS, and HTML
2. **Brotli**: Enable
3. **Rocket Loader**: Enable
4. **Early Hints**: Enable

### 7. Caching Settings

In **Caching** section:

1. **Caching Level**: Set to "Standard"
2. **Browser Cache TTL**: Set to "4 hours"
3. **Always Online**: Enable
4. **Development Mode**: Disable (for production)

## 🔧 Advanced Configuration

### Page Rules (Optional)

Create these page rules for better performance:

1. **API Caching**:
   - URL: `cvilo.com/api/*`
   - Settings: Cache Level: Bypass

2. **Dashboard Caching**:
   - URL: `cvilo.com/dashboard/*`
   - Settings: Cache Level: Bypass

3. **Static Assets**:
   - URL: `cvilo.com/*.js` OR `cvilo.com/*.css` OR `cvilo.com/*.png` OR `cvilo.com/*.jpg`
   - Settings: Cache Level: Cache Everything

### Workers (Optional)

You can create Cloudflare Workers for additional functionality:

```javascript
// Example worker for API rate limiting
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Add custom logic here
  return fetch(request)
}
```

## 🔍 Testing Your Setup

### 1. Test DNS Propagation

```bash
# Check if DNS is pointing to Cloudflare
dig cvilo.com
nslookup cvilo.com

# You should see Cloudflare IPs in the response
```

### 2. Test SSL Certificate

```bash
# Test SSL connection
curl -I https://cvilo.com

# Check certificate details
openssl s_client -connect cvilo.com:443 -servername cvilo.com
```

### 3. Test Cloudflare Headers

```bash
# Check if Cloudflare headers are present
curl -I https://cvilo.com

# You should see headers like:
# CF-RAY: xxxxxx
# Server: cloudflare
```

### 4. Test Your Application

Visit these URLs to test your setup:
- **Main Site**: https://cvilo.com
- **Dashboard**: https://cvilo.com/dashboard
- **API**: https://cvilo.com/api/health
- **Health Check**: https://cvilo.com/health

## 🔒 Security Considerations

### 1. Firewall Rules

In Cloudflare **Firewall** section, create these rules:

1. **Block Bad Bots**:
   - Rule: `(http.user_agent contains "bot" and not http.user_agent contains "googlebot")`
   - Action: Block

2. **Rate Limiting**:
   - Rule: `(http.request.uri contains "/api/")`
   - Action: Challenge (Captcha)
   - Rate: 10 requests per minute

3. **Block Suspicious IPs**:
   - Rule: `(ip.src in $suspicious_ips)`
   - Action: Block

### 2. WAF (Web Application Firewall)

Enable these WAF rules:

1. **SQL Injection**: Enable
2. **XSS**: Enable
3. **File Upload**: Enable
4. **LFI**: Enable
5. **RCE**: Enable

### 3. DDoS Protection

1. **DDoS Protection**: Enable
2. **Rate Limiting**: Enable
3. **Browser Integrity Check**: Enable

## 📊 Monitoring

### 1. Analytics

In Cloudflare **Analytics** section, monitor:

1. **Traffic**: Page views, unique visitors
2. **Security**: Threats blocked, requests challenged
3. **Performance**: Cache hit ratio, response times
4. **DNS**: Query volume, response times

### 2. Logs

Enable **Logpush** for detailed logs:

1. Go to **Logs** section
2. Enable **HTTP Requests Logs**
3. Configure log delivery to your preferred destination

### 3. Alerts

Set up alerts for:

1. **High traffic spikes**
2. **Security threats**
3. **SSL certificate expiration**
4. **DNS issues**

## 🚨 Troubleshooting

### Common Issues

1. **DNS Not Propagating**:
   ```bash
   # Check nameservers
   dig cvilo.com NS
   
   # Check propagation
   https://www.whatsmydns.net/
   ```

2. **SSL Certificate Issues**:
   ```bash
   # Check certificate
   openssl s_client -connect cvilo.com:443 -servername cvilo.com
   
   # Test from different locations
   https://www.ssllabs.com/ssltest/
   ```

3. **Cloudflare Not Working**:
   - Check if orange cloud is enabled
   - Verify SSL/TLS mode is "Full (strict)"
   - Check firewall rules

4. **Application Not Loading**:
   ```bash
   # Check if your server is accessible
   curl -I http://YOUR_SERVER_IP
   
   # Check nginx logs
   docker-compose logs nginx
   ```

### Performance Issues

1. **Slow Loading**:
   - Check cache settings
   - Enable Auto Minify
   - Enable Brotli compression

2. **API Timeouts**:
   - Check rate limiting rules
   - Verify backend services are running
   - Check nginx configuration

## 🔄 Maintenance

### 1. Regular Checks

- Monitor Cloudflare analytics weekly
- Check SSL certificate expiration monthly
- Review security logs regularly
- Update Cloudflare settings as needed

### 2. Backup Strategy

- Keep local copies of nginx configuration
- Document all Cloudflare settings
- Regular backups of your application data

### 3. Updates

- Keep Cloudflare settings updated
- Monitor for new security features
- Update firewall rules as needed

## 📞 Support

If you encounter issues:

1. Check Cloudflare status: https://www.cloudflarestatus.com/
2. Review Cloudflare documentation
3. Check your server logs
4. Test with Cloudflare disabled (gray cloud) temporarily

## ✅ Checklist

- [ ] Domain added to Cloudflare
- [ ] Nameservers updated at registrar
- [ ] DNS records configured (orange cloud enabled)
- [ ] SSL/TLS set to "Full (strict)"
- [ ] HSTS enabled
- [ ] Security settings configured
- [ ] Performance optimizations enabled
- [ ] Firewall rules set up
- [ ] Monitoring configured
- [ ] Testing completed
- [ ] Documentation updated

Your cvilo.com domain should now be fully configured with Cloudflare and working with your Docker setup! 