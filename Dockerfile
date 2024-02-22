FROM node:lts-alpine AS build

WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine AS aviator

WORKDIR /aviator
COPY --from=build /build/dist/ /aviator
COPY package.json /aviator
COPY router-config.json .

RUN npm install --omit=dev

EXPOSE 21000
EXPOSE 21001

CMD ["node", "./Main.js"]
