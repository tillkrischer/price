FROM node:14 AS fe-builder
WORKDIR /work
COPY price-fe/package.json ./
COPY price-fe/yarn.lock ./
RUN yarn install
COPY price-fe/src ./src
COPY price-fe/public ./public
COPY price-fe/.env-cmdrc.json ./
COPY price-fe/tsconfig.json ./
RUN yarn build

FROM node:14 AS be-builder
WORKDIR /work
COPY price-be/package.json ./
COPY price-be/yarn.lock ./
RUN yarn install
COPY price-be/src ./src
COPY price-be/.env-cmdrc.json ./
COPY price-be/tsconfig.json ./
RUN yarn build

FROM ubuntu
WORKDIR /usr/src/app
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y firefox firefox-geckodriver curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get install nodejs
COPY price-be/package.json ./
COPY price-be/yarn.lock ./
RUN npm install -g yarn
RUN yarn install --production=true
COPY --from=be-builder /work/.env-cmdrc.json ./
COPY --from=be-builder /work/build ./build
COPY --from=fe-builder /work/build ./public
EXPOSE 3000
VOLUME [ "/data" ]
CMD ["yarn", "start"]