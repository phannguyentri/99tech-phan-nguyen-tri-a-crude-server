FROM node:18-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000

# Default command to run in production
CMD ["npm", "start"] 