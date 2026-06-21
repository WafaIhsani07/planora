FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Hugging Face Spaces defaults to exposing port 7860
ENV PORT=7860
EXPOSE 7860

# Start server
CMD ["npm", "start"]
