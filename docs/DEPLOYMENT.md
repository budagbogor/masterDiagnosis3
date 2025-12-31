# Deployment Guide

Panduan deployment AutoDiag Master AI ke berbagai platform.

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Git
- Domain dan SSL certificate (untuk production)

### Environment Setup

1. **Clone Repository**
```bash
git clone https://github.com/budagbogor/kiro-1.git
cd kiro-1
```

2. **Install Dependencies**
```bash
npm install --production
```

3. **Environment Variables**
```bash
cp .env.example .env.production
```

Edit `.env.production`:
```env
# Production Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# OpenAI API
OPENAI_API_KEY=your_production_openai_key

# Database
DATABASE_URL="file:./db/production.db"

# Security
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://yourdomain.com
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Build Application**
```bash
npm run build
```

6. **Start Production Server**
```bash
npm start
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  autodiag:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./db/production.db
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./db:/app/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - autodiag
    restart: unless-stopped
```

### Build dan Run

```bash
# Build image
docker build -t autodiag-master-ai .

# Run dengan docker-compose
docker-compose up -d
```

## ☁️ Vercel Deployment

### 1. Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

### 2. GitHub Integration

1. Push code ke GitHub repository
2. Connect repository di Vercel dashboard
3. Configure environment variables
4. Deploy otomatis setiap push ke main branch

### Environment Variables di Vercel

```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=file:./db/production.db
NEXTAUTH_SECRET=your_secure_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

### vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 🌐 Netlify Deployment

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## 🖥️ VPS/Server Deployment

### 1. Server Setup (Ubuntu 20.04+)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/budagbogor/kiro-1.git
cd kiro-1

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env.production
# Edit .env.production dengan konfigurasi production

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Build application
npm run build
```

### 3. PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'autodiag-master-ai',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/autodiag-master-ai',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/autodiag
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/autodiag /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 Security Considerations

### 1. Environment Variables
- Jangan commit file `.env` ke repository
- Gunakan secrets management untuk production
- Rotate API keys secara berkala

### 2. Database Security
- Backup database secara berkala
- Gunakan encrypted storage untuk production
- Implement proper access controls

### 3. SSL/TLS
- Gunakan SSL certificate untuk HTTPS
- Configure proper security headers
- Implement HSTS

### 4. Monitoring
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/autodiag

# Monitor with PM2
pm2 monit

# Setup alerts
pm2 install pm2-server-monit
```

## 📊 Performance Optimization

### 1. Next.js Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
```

### 2. Database Optimization
- Index frequently queried columns
- Implement connection pooling
- Regular database maintenance

### 3. Caching Strategy
- Implement Redis for session storage
- Use CDN for static assets
- Cache API responses where appropriate

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/autodiag-master-ai
          git pull origin main
          npm ci --production
          npm run build
          pm2 reload autodiag-master-ai
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database setup dan seeded
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance optimization applied
- [ ] CI/CD pipeline configured
- [ ] Domain DNS configured
- [ ] Health checks implemented