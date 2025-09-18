# ============================================================================
# Minimal Dockerfile for sunburst-voice
# ============================================================================
FROM node:20-alpine

WORKDIR /app

# install prod deps
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
