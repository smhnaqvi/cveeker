# Stage 1: Build the Go binary
FROM golang:1.23.0-alpine AS builder

# Define build arguments (from GitHub Actions)
ARG BUILD_VERSION
ARG BUILD_DATE
ARG API_BASE_URL

# Enable Go modules and set working dir
WORKDIR /app

# Install build tools
RUN apk add --no-cache git

# Copy go.mod and go.sum first (for caching dependencies)
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the binary statically with build-time variables
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-X main.BuildVersion=${BUILD_VERSION} -X main.BuildDate=${BUILD_DATE} -X main.APIBaseURL=${API_BASE_URL}" \
    -o app

# Stage 2: Run minimal image
FROM alpine:latest

# Add non-root user for security
RUN adduser -D appuser
USER appuser

WORKDIR /home/appuser

# Copy the compiled binary from builder
COPY --from=builder /app/app .

# Expose the app port
EXPOSE 8081

# Command to run the app
CMD ["./app"]