FROM node:18-alpine

WORKDIR /backend

COPY package.json ./
COPY yarn.lock ./
COPY index.js ./
COPY src ./src

RUN apk add --no-cache tzdata
RUN yarn install --production

EXPOSE 6996