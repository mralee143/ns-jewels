FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# sharp needs install scripts for Alpine (linuxmusl) native bindings used by next/image.
RUN npm ci --ignore-scripts && npm rebuild sharp

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# prisma.config.ts requires a URL; generate does not connect. Real URL is set at runtime.
ENV DATABASE_URL=postgres://nsjewels:ns-app@websites_ns-db:5432/ns-jewels?sslmode=disable
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma migrate deploy at container start (see docker-entrypoint.sh).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/lib/resolve-database-url.ts ./src/lib/resolve-database-url.ts
COPY --from=builder /app/scripts/resolve-database-url.mjs ./scripts/resolve-database-url.mjs
COPY docker-entrypoint.sh /entrypoint.sh
USER root
RUN apk add --no-cache netcat-openbsd \
  && npm install prisma@7.8.0 dotenv@17.4.2 --no-save --ignore-scripts \
  && chmod +x /entrypoint.sh \
  && chown -R nextjs:nodejs /app/node_modules
USER nextjs
EXPOSE 4000
# Override at runtime via --env-file or -e (standalone server.js reads PORT / HOSTNAME).
ENV PORT=4000
ENV HOSTNAME=0.0.0.0
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
