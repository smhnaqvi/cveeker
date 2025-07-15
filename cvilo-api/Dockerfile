# Multi-stage build for optimized production image
FROM golang:1.23-alpine AS builder

# Define build arguments
ARG BUILD_VERSION
ARG BUILD_DATE
ARG API_BASE_URL
ARG AI_MODEL
ARG AI_TOKEN
ARG AI_URL
ARG CORS_ORIGIN
ARG HOST
ARG JWT_SECRET
ARG LINKEDIN_CLIENT_ID
ARG LINKEDIN_CLIENT_SECRET
ARG LINKEDIN_REDIRECT_URL
ARG MODELS_BASE_URL
ARG PORT
ARG POSTGRES_DB
ARG POSTGRES_HOST
ARG POSTGRES_PASSWORD
ARG POSTGRES_PORT
ARG POSTGRES_SSLMODE
ARG POSTGRES_USER
ARG USE_GITHUB_MODELS

# Set build-time environment variables
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE
ENV API_BASE_URL=$API_BASE_URL

# Install build dependencies
RUN apk add --no-cache \
    git \
    ca-certificates \
    tzdata \
    gcc \
    musl-dev \
    pkgconfig

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Create .env file from build arguments
RUN echo "AI_MODEL=$AI_MODEL" > .env && \
    echo "AI_TOKEN=$AI_TOKEN" >> .env && \
    echo "AI_URL=$AI_URL" >> .env && \
    echo "CORS_ORIGIN=$CORS_ORIGIN" >> .env && \
    echo "HOST=$HOST" >> .env && \
    echo "JWT_SECRET=$JWT_SECRET" >> .env && \
    echo "LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID" >> .env && \
    echo "LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET" >> .env && \
    echo "LINKEDIN_REDIRECT_URL=$LINKEDIN_REDIRECT_URL" >> .env && \
    echo "MODELS_BASE_URL=$MODELS_BASE_URL" >> .env && \
    echo "PORT=$PORT" >> .env && \
    echo "POSTGRES_DB=$POSTGRES_DB" >> .env && \
    echo "POSTGRES_HOST=$POSTGRES_HOST" >> .env && \
    echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env && \
    echo "POSTGRES_PORT=$POSTGRES_PORT" >> .env && \
    echo "POSTGRES_SSLMODE=$POSTGRES_SSLMODE" >> .env && \
    echo "POSTGRES_USER=$POSTGRES_USER" >> .env && \
    echo "USE_GITHUB_MODELS=$USE_GITHUB_MODELS" >> .env

# Build the application with optimizations and build-time variables
RUN CGO_ENABLED=1 GOOS=linux go build \
    -a \
    -installsuffix cgo \
    -ldflags="-w -s -X main.BuildVersion=$BUILD_VERSION -X main.BuildDate=$BUILD_DATE" \
    -o cvilo-api .

# Production stage
FROM alpine:latest

# Define build arguments for production stage
ARG BUILD_VERSION
ARG BUILD_DATE
ARG API_BASE_URL

# Set runtime environment variables
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE
ENV API_BASE_URL=$API_BASE_URL

# Install runtime dependencies
RUN apk --no-cache add \
    ca-certificates \
    tzdata \
    postgresql-client

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/cvilo-api .

# Copy .env file from builder stage
COPY --from=builder /app/.env ./

# Set proper ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/ping || exit 1

# Run the application
CMD ["./cvilo-api"] 