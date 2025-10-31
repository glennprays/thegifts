# 1️⃣ Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
RUN npx prisma generate
RUN npm run build
RUN npm prune --production


# 2️⃣ Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production
CMD npx prisma migrate deploy && node build
