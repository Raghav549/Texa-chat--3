# TEXA Backend Dockerfile - Optimized for Render
# Multi-stage build for production deployment

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9.12.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build backend
RUN pnpm run build

# Stage 2: Production Runtime
FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9.12.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]
