FROM node:lts-alpine AS build

WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine AS aviator

WORKDIR /aviator
COPY --from=build /build/dist/ /aviator
COPY --from=build /build/node_modules ./node_modules
COPY router-config.json .

EXPOSE 21000 # Input
EXPOSE 21001 # Webserver

RUN node ./main.js
