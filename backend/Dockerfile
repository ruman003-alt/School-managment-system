FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run prisma:generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
