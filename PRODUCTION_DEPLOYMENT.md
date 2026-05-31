# TEXA - Production Deployment Guide

## Overview

This guide covers deploying TEXA to production with:
- Backend API on Render
- PostgreSQL database
- Real Twilio SMS OTP integration
- WebRTC signaling
- End-to-end encryption
- Real-time messaging

## Prerequisites

1. **GitHub Account** - For version control
2. **Render Account** - For backend deployment (https://render.com)
3. **Twilio Account** - For SMS OTP (https://twilio.com)
4. **PostgreSQL Database** - For data storage
5. **Domain Name** - For custom domain (optional)

## Step 1: Prepare GitHub Repository

```bash
# Initialize git if not already done
cd /home/ubuntu/texa
git init

# Add all files
git add -A

# Commit
git commit -m "TEXA - Production Ready Messaging App"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/texa.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up PostgreSQL Database

### Option A: Render PostgreSQL

1. Go to https://render.com
2. Click "New +" → "PostgreSQL"
3. Fill in details:
   - Name: `texa-db`
   - Database: `texa`
   - User: `texa_user`
   - Region: Choose closest to you
4. Create database
5. Copy connection string (will look like):
   ```
   postgresql://texa_user:PASSWORD@texa-db.c.render.com/texa
   ```

### Option B: Local PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb texa

# Create user
sudo -u postgres createuser texa_user

# Set password
sudo -u postgres psql -c "ALTER USER texa_user WITH PASSWORD 'strong_password';"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE texa TO texa_user;"

# Connection string
postgresql://texa_user:strong_password@localhost:5432/texa
```

## Step 3: Configure Environment Variables

Create `.env.production` file:

```env
# Database
DATABASE_URL=postgresql://texa_user:PASSWORD@texa-db.c.render.com/texa

# Twilio SMS OTP
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_SERVICE_SID=your_service_sid
TWILIO_PHONE_NUMBER=+1234567890

# Encryption
ENCRYPTION_KEY=your_32_byte_hex_key_here

# API
API_PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# WebRTC
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
TURN_SERVER=your_turn_server_url
TURN_USERNAME=your_turn_username
TURN_PASSWORD=your_turn_password
```

### Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Fill in details:
   - Name: `texa-api`
   - Environment: `Node`
   - Build Command: `pnpm install --frozen-lockfile && pnpm run build`
   - Start Command: `node dist/index.js`
   - Region: Choose closest to you
5. Add environment variables from `.env.production`
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy API URL (will look like): `https://texa-api.onrender.com`

## Step 5: Configure Twilio

1. Go to https://twilio.com
2. Create account or sign in
3. Go to "Messaging" → "Services"
4. Create new service:
   - Friendly name: `TEXA OTP`
   - Select "Verify"
5. Go to "Verify" → "Services"
6. Create new service:
   - Friendly name: `TEXA SMS OTP`
   - Default SMS Sender: Your phone number
7. Copy credentials:
   - Account SID
   - Auth Token
   - Service SID

## Step 6: Run Database Migrations

```bash
# Connect to production database
export DATABASE_URL=postgresql://texa_user:PASSWORD@texa-db.c.render.com/texa

# Run migrations
pnpm run db:push

# Verify
pnpm run db:studio
```

## Step 7: Deploy Mobile App

### For iOS (Apple App Store)

```bash
# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### For Android (Google Play Store)

```bash
# Build for production
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

## Step 8: Configure App Settings

Update `app.config.ts`:

```typescript
const env = {
  appName: "TEXA",
  appSlug: "texa",
  logoUrl: "https://your-s3-bucket.s3.amazonaws.com/icon.png",
  scheme: "texa",
  iosBundleId: "space.manus.texa",
  androidPackage: "space.manus.texa",
  apiUrl: "https://texa-api.onrender.com",
  websocketUrl: "wss://texa-api.onrender.com",
};
```

## Step 9: Set Up Monitoring

### Render Monitoring

1. Go to Render dashboard
2. Click on `texa-api` service
3. Go to "Monitoring"
4. Enable:
   - Error tracking
   - Performance monitoring
   - Uptime monitoring

### Error Tracking (Sentry)

```bash
# Install Sentry
pnpm add @sentry/node

# Initialize in server/_core/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

## Step 10: Security Checklist

- [ ] Enable HTTPS on all endpoints
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Set up SSL/TLS certificates
- [ ] Enable two-factor authentication
- [ ] Set up backup strategy
- [ ] Enable audit logging
- [ ] Monitor for suspicious activity

## Step 11: Performance Optimization

### Database

```sql
-- Create indexes for faster queries
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_chats_participants ON chats(participants);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

### API

```typescript
// Enable compression
import compression from "compression";
app.use(compression());

// Enable caching
import redis from "redis";
const cache = redis.createClient();

// Rate limiting
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
```

## Step 12: Monitoring & Maintenance

### Daily

- Check error logs
- Monitor API performance
- Verify database connectivity

### Weekly

- Review user metrics
- Check backup status
- Monitor storage usage

### Monthly

- Update dependencies
- Review security logs
- Optimize database queries

## Troubleshooting

### API Not Starting

```bash
# Check logs
render logs texa-api

# Verify environment variables
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL
```

### Database Connection Issues

```bash
# Verify connection string
psql postgresql://texa_user:PASSWORD@texa-db.c.render.com/texa

# Check firewall rules
# Ensure Render IP is whitelisted
```

### Twilio SMS Not Working

```bash
# Verify credentials
curl -X GET https://api.twilio.com/2010-04-01/Accounts \
  -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN

# Test SMS
curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages \
  -d "To=+1234567890&From=+0987654321&Body=Test" \
  -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/YOUR_USERNAME/texa/issues
- Render Support: https://render.com/support
- Twilio Support: https://twilio.com/support

## Next Steps

1. Monitor production metrics
2. Gather user feedback
3. Plan feature updates
4. Scale infrastructure as needed
5. Implement advanced features (AI, analytics, etc.)

---

**Deployment Date:** [Current Date]
**Status:** Production Ready
**Version:** 1.0.0
