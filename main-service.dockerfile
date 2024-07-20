FROM node:22-alpine AS build
WORKDIR /app
RUN npm i --global pnpm
COPY . .
RUN \
  pnpm i --no-frozen-lockfile --filter=main-service && \
  cd ./packages/main-service && \
  pnpm build-and-deploy

FROM oven/bun:1.1.20-alpine
WORKDIR /app
COPY --from=build ./app/packages/main-service/deployed .
EXPOSE 3000
ENV \
  NODE_ENV=production \
  PORT=3000 \
  LIVE_MARKET_PRICES_SERVICE_URL=$LIVE_MARKET_PRICES_SERVICE_URL \
  LIVE_MARKET_PRICES_SERVICE_WS_URL=$LIVE_MARKET_PRICES_SERVICE_WS_URL \
  INSTRUMENT_INFO_SERVICE_URL=$INSTRUMENT_INFO_SERVICE_URL \
  REDIS_CONNECTION_URL=$REDIS_CONNECTION_URL \
  POSTGRES_DB_CONNECTION_URL=$POSTGRES_DB_CONNECTION_URL \
  ENABLE_NGROK_TUNNEL=$ENABLE_NGROK_TUNNEL \
  NGROK_TUNNEL_AUTH_TOKEN=$NGROK_TUNNEL_AUTH_TOKEN \
  DB_LOGGING=$DB_LOGGING
ENTRYPOINT ["bun", "./dist/index.js"]

# https://github.com/pnpm/pnpm/issues/3114#issuecomment-1512805370
