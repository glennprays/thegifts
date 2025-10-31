# Stage 1: build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                        # install all deps (including dev)
COPY . .                         
RUN npm run build                 # compile SvelteKit (includes TypeScript => JS)
RUN npm prune --production        # remove devDependencies

# Stage 2: create production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build build    # copy built app
COPY --from=builder /app/node_modules node_modules
COPY package.json .
ENV NODE_ENV=production
USER node                           # run as non-root user for security
EXPOSE 3000
CMD ["node", "build/index.js"]      # start the server
