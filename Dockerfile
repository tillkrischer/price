FROM node:14 AS fe-builder
WORKDIR /work
COPY price-fe/package.json ./
COPY price-fe/yarn.lock ./
RUN yarn install
COPY price-fe .
RUN yarn build

FROM node:14 AS be-builder
WORKDIR /work
COPY price-be/package.json ./
COPY price-be/yarn.lock ./
RUN yarn install
COPY price-be .
RUN yarn build

FROM node:14 
WORKDIR /usr/src/app
COPY price-be/package.json ./
COPY price-be/yarn.lock ./
RUN yarn install --production=true
COPY --from=be-builder /work/.env-cmdrc.json ./
COPY --from=be-builder /work/build ./build
COPY --from=fe-builder /work/build ./public
EXPOSE 3000
VOLUME [ "/data" ]
CMD ["yarn", "start"]
