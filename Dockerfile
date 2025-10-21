FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (use package-lock for reproducible install)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create directory for sessions and make sure it's writable
RUN mkdir -p /usr/src/app/sessions && chown -R node:node /usr/src/app/sessions

USER node

# The bot is a long-running process
CMD ["node", "index.js"]
