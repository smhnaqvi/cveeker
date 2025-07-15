# Simple Dockerfile for client area
FROM node:20-alpine

# Define build arguments
ARG BUILD_VERSION
ARG BUILD_DATE
ARG API_BASE_URL

# Set build-time environment variables
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE
ENV VITE_API_URL=$API_BASE_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Create .env file from build arguments
RUN echo "VITE_API_URL=$API_BASE_URL" > .env && \
    echo "BUILD_VERSION=$BUILD_VERSION" >> .env && \
    echo "BUILD_DATE=$BUILD_DATE" >> .env

# Build the application with environment variables
RUN yarn build

# Install a simple HTTP server
RUN yarn global add serve

# Expose port
EXPOSE 3009

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3009"] 