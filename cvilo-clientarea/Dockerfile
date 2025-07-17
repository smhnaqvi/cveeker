# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Define build arguments (only non-sensitive data)
ARG BUILD_VERSION
ARG BUILD_DATE
ARG VITE_API_URL

# Set build-time environment variables
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn config set network-timeout 1000000 && \
    yarn install --prefer-offline --no-optional

# Copy source code
COPY . .

# Create .env file from build arguments
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "BUILD_VERSION=$BUILD_VERSION" >> .env && \
    echo "BUILD_DATE=$BUILD_DATE" >> .env

# Build the application with environment variables
RUN yarn build

# Production stage - Simple static file server
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Use minimal nginx config for static file serving
RUN echo 'server { \
    listen 3009; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3009

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 