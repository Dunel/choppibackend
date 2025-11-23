FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g @nestjs/cli
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
