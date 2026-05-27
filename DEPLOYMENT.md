# TEXA Deployment Guide

## Overview

TEXA is a production-ready messaging platform with end-to-end encryption, real-time features, and a comprehensive backend API. This guide covers deployment on various platforms.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEXA Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  iOS App     │  │ Android App  │  │  Web App     │       │
│  │  (Expo)      │  │  (Expo)      │  │  (React)     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │                                  │
│                    ┌──────▼──────┐                           │
│                    │   Nginx      │                           │
│                    │ (Reverse     │                           │
│                    │  Proxy)      │                           │
│                    └──────┬───────┘                           │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│    ┌────▼────┐     ┌─────▼──────┐   ┌──────▼────┐          │
│    │ tRPC    │     │ Socket.IO  │   │  REST    │          │
│    │ API     │     │ Real-time  │   │  API     │          │
│    └────┬────┘     └─────┬──────┘   └──────┬────┘          │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                           │
│                    │   Express   │                           │
│                    │   Backend   │                           │
│                    └──────┬──────┘                           │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│    ┌────▼────┐     ┌─────▼──────┐   ┌──────▼────┐          │
│    │PostgreSQL│    │   Redis    │   │  S3/File  │          │
│    │Database  │    │   Cache    │   │  Storage  │          │
│    └──────────┘    └────────────┘   └───────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker & Docker Compose
- Node.js 22+
- PostgreSQL 16+
- Redis 7+
- SSL/TLS certificates (for production)

## Local Development

### 1. Setup Environment

```bash
cd /home/ubuntu/texa
cp .env.example .env
# Edit .env with your local configuration
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Database

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

This starts:
- Metro bundler on port 8081 (Expo preview)
- Express backend on port 3000
- Socket.IO on port 3000

## Docker Deployment

### 1. Build Docker Image

```bash
docker build -t texa-backend:latest .
```

### 2. Run with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3000
- Nginx reverse proxy on ports 80/443

### 3. Verify Deployment

```bash
# Check services
docker-compose ps

# View logs
docker-compose logs -f backend

# Health check
curl http://localhost/health
```

## Production Deployment

### 1. Prepare SSL Certificates

```bash
mkdir -p ssl
# Copy your SSL certificates
cp /path/to/cert.pem ssl/
cp /path/to/key.pem ssl/
```

### 2. Set Production Environment

```bash
# Update .env for production
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export REDIS_URL=redis://...
export JWT_SECRET=your-secure-secret
export ENCRYPTION_KEY=your-encryption-key
```

### 3. Deploy to Cloud

#### AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Clone repository
git clone https://github.com/your-org/texa.git
cd texa

# Setup environment
cp .env.example .env
# Edit .env with production values

# Start with Docker Compose
docker-compose up -d
```

#### Google Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/your-project/texa-backend

# Deploy
gcloud run deploy texa-backend \
  --image gcr.io/your-project/texa-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=$DATABASE_URL,REDIS_URL=$REDIS_URL
```

#### Heroku

```bash
# Create app
heroku create texa-backend

# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set REDIS_URL=redis://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

## Database Migrations

### Create Migration

```bash
npm run db:generate
```

### Apply Migrations

```bash
npm run db:push
```

### Rollback Migration

```bash
npm run db:rollback
```

## Monitoring & Logging

### Application Logs

```bash
# Docker logs
docker-compose logs -f backend

# System logs
tail -f /var/log/texa/app.log
```

### Health Checks

```bash
# API health
curl https://api.texa.app/health

# Database
curl https://api.texa.app/health/db

# Redis
curl https://api.texa.app/health/redis
```

### Metrics

- CPU Usage
- Memory Usage
- Request Rate
- Response Time
- Error Rate
- Database Connections
- Redis Connections

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Environment variables secured
- [ ] Database backups enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] JWT secrets rotated
- [ ] Encryption keys secured
- [ ] Firewall rules configured
- [ ] DDoS protection enabled
- [ ] Regular security audits

## Backup & Recovery

### Database Backup

```bash
# Manual backup
docker-compose exec postgres pg_dump -U texa texa_db > backup.sql

# Automated backup (daily)
0 2 * * * docker-compose exec postgres pg_dump -U texa texa_db > /backups/texa_$(date +\%Y\%m\%d).sql
```

### Restore from Backup

```bash
docker-compose exec postgres psql -U texa texa_db < backup.sql
```

## Scaling

### Horizontal Scaling

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3
```

### Load Balancing

Update nginx.conf to distribute traffic:

```nginx
upstream backend {
    server backend:3000;
    server backend_2:3000;
    server backend_3:3000;
}
```

### Database Optimization

- Enable connection pooling (PgBouncer)
- Create indexes on frequently queried columns
- Archive old messages
- Partition large tables

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep DATABASE_URL

# Test database connection
docker-compose exec backend npm run db:check
```

### High memory usage

```bash
# Check Node.js heap
docker-compose exec backend node -e "console.log(require('v8').getHeapStatistics())"

# Restart service
docker-compose restart backend
```

### Socket.IO connection issues

```bash
# Check WebSocket support
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" https://api.texa.app/socket.io

# Verify CORS configuration
curl -H "Origin: https://texa.app" -i https://api.texa.app/api/health
```

## Performance Optimization

1. **Database**: Use connection pooling, indexes, and query optimization
2. **Caching**: Redis for session storage and message caching
3. **Compression**: Gzip enabled for all responses
4. **CDN**: CloudFront for static assets
5. **Monitoring**: Datadog/Sentry for error tracking

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-org/texa/issues
- Documentation: https://docs.texa.app
- Email: support@texa.app
