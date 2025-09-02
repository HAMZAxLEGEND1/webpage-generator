# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build Next.js app
RUN npm run build

# Expose port (Fly.io sets PORT env variable)
ENV PORT 8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
