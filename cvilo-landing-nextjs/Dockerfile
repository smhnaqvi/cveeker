# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Define build arguments (only non-sensitive data)
ARG BUILD_VERSION
ARG BUILD_DATE
ARG LANDING_BASE_URL
ARG API_BASE_URL
ARG CLIENT_BASE_URL

# Set build-time environment variables
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE
ENV LANDING_BASE_URL=$LANDING_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$API_BASE_URL
ENV NEXT_PUBLIC_LANDING_URL=$LANDING_BASE_URL
ENV NEXT_PUBLIC_CLIENT_URL=$CLIENT_BASE_URL

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Create .env file from build arguments
RUN echo "NEXT_PUBLIC_API_URL=$API_BASE_URL" > .env && \
    echo "NEXT_PUBLIC_LANDING_URL=$LANDING_BASE_URL" >> .env && \
    echo "NEXT_PUBLIC_CLIENT_URL=$CLIENT_BASE_URL" >> .env && \
    echo "BUILD_VERSION=$BUILD_VERSION" >> .env && \
    echo "BUILD_DATE=$BUILD_DATE" >> .env

# Build the application with environment variables
RUN yarn build

# Production stage
FROM node:20-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Set proper ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

# Start the application
CMD ["yarn", "start"] 