# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate
COPY src ./src/
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp --ingroup nodejs

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy generated Prisma client from builder (avoids re-generation)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy prisma schema and config (needed at runtime for migrations)
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copy compiled application
COPY --from=builder /app/dist ./dist

RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 3001

CMD ["node", "dist/server.js"]
