# Use a Node.js base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
FROM base AS builder

ENV NODE_ENV production
ENV PORT=3001

RUN yarn build

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone build from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3001

# Start the Next.js application
CMD ["node", "server.js"]