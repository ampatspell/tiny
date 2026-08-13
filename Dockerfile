FROM node:24-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache coreutils curl

COPY package*.json .
COPY .npmrc .
RUN npm ci
COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
CMD [ "npm", "start" ]

HEALTHCHECK \
  --interval=1m \
  --timeout=10s \
  --start-period=5s \
  --retries=10 \
  CMD curl -f http://localhost:3000 || exit 1
