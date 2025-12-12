From node:18-alpine AS builder

WORKDIR /usr/src/app
copy app/package.json ./
RUN npm ci --production
COPY app/ ./

From node:18-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]

