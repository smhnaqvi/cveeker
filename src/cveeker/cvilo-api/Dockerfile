# Build stage
FROM golang:1.23-alpine AS builder

# Install necessary build tools and C dependencies for SQLite
RUN apk add --no-cache \
    git \
    ca-certificates \
    tzdata \
    gcc \
    musl-dev \
    sqlite-dev \
    pkgconfig

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o cvilo-api .

# Final stage
FROM alpine:latest

# Install necessary runtime dependencies including SQLite
RUN apk --no-cache add \
    ca-certificates \
    tzdata \
    sqlite

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/cvilo-api .

# Copy any additional files needed
COPY --from=builder /app/.env* ./

# Change ownership to non-root user
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