FROM node:22-alpine

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

# Create uploads folder and give permissions to HF user
RUN mkdir -p uploads && chown -R 1000:1000 /app
USER 1000

# Hugging Face Spaces defaults to exposing port 7860
ENV PORT=7860
EXPOSE 7860

# Start server
CMD ["npm", "start"]
