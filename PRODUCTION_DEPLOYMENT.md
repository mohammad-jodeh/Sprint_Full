# 🚀 Production Deployment Guide - Sprint Full (Simplified Jira Clone)

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Domain name (for HTTPS)
- SSL Certificate (Let's Encrypt recommended)

---

## Part 1: Backend Setup

### 1.1 Environment Configuration

1. Copy `.env.example` to `.env` in the backend directory:
```bash
cd sprintify_backend/finalAPI
cp .env.example .env
```

2. **Edit `.env` with your production values:**

```env
# Database (PostgreSQL)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=sprintify_prod
DB_USER=sprintify_user
DB_PASSWORD=your_very_strong_password_min_32_chars

# Node Environment
NODE_ENV=production

# Server Configuration
PORT=4000
API_PREFIX=/api/v1

# JWT Security - GENERATE A STRONG SECRET (at least 32 characters, random)
JWT_SECRET=your_generated_super_secure_jwt_secret_key_change_this_in_production_min_32_chars_i-use-openssl
JWT_EXPIRY=24h

# Frontend URL (CORS - where your frontend is hosted)
FRONTEND_URL=https://yourdomain.com

# Email Service (Optional)
POSTMARK_API_TOKEN=your_postmark_token_here

# Logging
LOG_LEVEL=info
```

**⚠️ CRITICAL: Generate a strong JWT_SECRET**
```bash
# Generate using openssl
openssl rand -base64 32

# Or use Node:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.2 Database Setup

```bash
# Create PostgreSQL database and user
psql -U postgres

-- In PostgreSQL shell:
CREATE USER sprintify_user WITH PASSWORD 'your_password';
CREATE DATABASE sprintify_prod OWNER sprintify_user;
ALTER ROLE sprintify_user CREATEDB;
```

### 1.3 Build Backend

```bash
cd sprintify_backend/finalAPI
npm install
npm run build
```

### 1.4 Run Backend (Production)

```bash
# Option A: Direct Node (after build)
NODE_ENV=production npm start

# Option B: Using PM2 (Recommended for production)
npm install -g pm2
pm2 start dist/index.js --name "sprint-api" --env NODE_ENV=production
pm2 save
pm2 startup
```

---

## Part 2: Frontend Setup

### 2.1 Environment Configuration

1. Create `.env.production` in frontend directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

2. Or update `.env.example`:

```bash
cd sprintify_frontend
cp .env.example .env.production
```

### 2.2 Build Frontend

```bash
npm install
npm run build
# Creates optimized dist/ folder
```

### 2.3 Deploy Frontend (Static Files)

Options:

**Option A: Vercel/Netlify**
```bash
# Vercel
npm install -g vercel
vercel --prod

# Update VITE_API_BASE_URL in Vercel dashboard
```

**Option B: Traditional Server (Nginx/Apache)**
```bash
# Copy dist/ to web server
scp -r dist/ user@server:/var/www/sprintify/

# Nginx configuration (see section 4.3)
```

---

## Part 3: HTTPS & SSL Setup

### 3.1 Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com
```

### 3.2 Nginx Configuration (Reverse Proxy)

Create `/etc/nginx/sites-available/sprintify`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Frontend (yourdomain.com)
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    root /var/www/sprintify;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API (api.yourdomain.com)
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/sprintify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Part 4: Production Checklist

### Pre-Deployment
- [ ] JWT_SECRET is strong and random (32+ chars)
- [ ] Database password is strong
- [ ] FRONTEND_URL is set correctly for CORS
- [ ] SSL certificates are valid
- [ ] Database backups are configured
- [ ] All environment variables are set
- [ ] Backend `.env` file is NOT in git/repo
- [ ] Build passes without errors
- [ ] Frontend environment is set to production

### Post-Deployment
- [ ] Backend API is responding (test health-check endpoint)
- [ ] Frontend loads and displays correctly
- [ ] Can login successfully
- [ ] Can create projects
- [ ] Can create and update issues
- [ ] Can drag issues between sprints (websocket working)
- [ ] CORS headers are correct
- [ ] HTTPS redirects work
- [ ] Security headers are present

### Monitoring & Maintenance
- [ ] Setup error logging (integrate with Sentry, LogRocket, etc.)
- [ ] Setup database backups (daily recommended)
- [ ] Monitor API response times
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Setup automatic SSL renewal (certbot has this built-in)
- [ ] Keep dependencies updated monthly
- [ ] Monitor for security vulnerabilities

---

## Part 5: Troubleshooting

### Issue: "Not authorized, token not found"
**Solution:** Ensure frontend `.env` has correct API URL and token is being stored in localStorage

### Issue: CORS errors in browser
**Solution:** Check `FRONTEND_URL` in backend `.env` matches your frontend domain exactly

### Issue: WebSocket connection fails
**Solution:** Ensure SSL/TLS is properly configured and proxy supports websockets (nginx config above does)

### Issue: Database connection fails
**Solution:** Verify PostgreSQL credentials and that database is accessible from your server

### Issue: Build fails
**Solution:** 
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Part 6: Security Best Practices

✅ **Already Implemented:**
- JWT authentication
- Password hashing (bcrypt)
- SQL injection protection (TypeORM)
- CORS with domain whitelist
- Security headers (CSP, X-Frame-Options, etc.)
- Environment variable secrets
- Request size limits (10MB)

➕ **Recommended Additional:**
- Rate limiting (implement with express-rate-limit)
- DDoS protection (Cloudflare)
- WAF (Web Application Firewall)
- Database encryption at rest
- Regular penetration testing
- Two-factor authentication
- Audit logging
- Data backup and disaster recovery plan

---

## Part 7: Zero-Downtime Deployment (Optional)

Using PM2 and Nginx:

```bash
# Deploy new version
cd sprintify_backend/finalAPI
npm install
npm run build

# Reload without stopping
pm2 reload sprint-api

# Or zero-downtime
pm2 restart sprint-api --watch
```

---

## Support & Documentation

- **API Documentation:** Available at `https://api.yourdomain.com/api/v1`
- **Frontend Repo:** `sprintify_frontend/`
- **Backend Repo:** `sprintify_backend/finalAPI/`
- **Issues:** Report via GitHub issues

---

**Last Updated:** April 14, 2026
**Status:** Production Ready ✅
