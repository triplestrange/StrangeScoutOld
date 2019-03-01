FROM alpine AS builder
WORKDIR /strangescout
RUN apk add --update python make g++ nodejs nodejs-npm
COPY ./frontend/web/package-lock.json ./
COPY ./frontend/web/package.json ./
RUN npm install
COPY ./frontend/web/ ./
ARG SS_VERSION
ARG JSCOUT_DOMAIN
RUN sed -i s/0.0.0/$SS_VERSION/ src/environments/environment.prod.ts
RUN sed -i s/localhost/$JSCOUT_DOMAIN/ src/environments/environment.prod.ts
RUN node_modules/.bin/ng build --prod --aot --source-map=false

FROM alpine
WORKDIR /server
RUN apk add --update bash python make g++ nodejs nodejs-npm
COPY ./server/package-lock.json ./
COPY ./server/package.json ./
RUN npm install
COPY ./server/ ./
# patch pouchdb server to set cookie expiry time
RUN patch ./node_modules/express-pouchdb/lib/routes/session.js ./session.patch
COPY --from=builder /strangescout/dist/jscout ./static
EXPOSE 80 443
ENTRYPOINT ["node", "index.js"]
