FROM node:23-alpine AS deps
WORKDIR /home/node
COPY package*.json ./
RUN npm install

FROM node:23-alpine AS build
WORKDIR /home/node
COPY --from=deps /home/node/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:23-alpine AS dev
WORKDIR /home/node

COPY --chown=node:node . .
