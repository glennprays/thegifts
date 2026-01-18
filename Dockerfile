# 1️⃣ Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .
RUN npm run build

# Keep tsx and dotenv for running migrations at runtime
RUN npm prune --production && \
    npm install tsx dotenv


# 2️⃣ Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy build output and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy migration scripts and SQL files
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/migrations ./migrations

EXPOSE 3000

ENV NODE_ENV=production

# Sync migration state, run migrations, then start the app
CMD npm run db:sync && npm run db:migrate && node build
