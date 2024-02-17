FROM node:lts-alpine AS build

WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine AS aviator

WORKDIR /aviator
COPY --from=build /build/dist/* .
COPY router-config.json .