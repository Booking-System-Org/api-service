FROM node:23-alpine
WORKDIR /home/node

COPY --chown=node:node . .
RUN npm install
