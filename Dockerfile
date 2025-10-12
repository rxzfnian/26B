# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY deploy/package.json ./package.json

# Install dependencies
RUN npm install --omit=dev

# Copy server source and data file
COPY deploy/src ./src
COPY data.csv ./data.csv

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "start"]


