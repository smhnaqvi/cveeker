# Simple Dockerfile for client area
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Install a simple HTTP server
RUN yarn global add serve

# Expose port
EXPOSE 3009

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3009"] 