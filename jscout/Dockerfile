FROM alpine AS builder
WORKDIR /strangescout
RUN apk add --update python make g++ nodejs nodejs-npm
COPY ./package-lock.json ./
COPY ./package.json ./
RUN npm install
COPY ./ ./
ARG SS_VERSION
ARG JSCOUT_DOMAIN
RUN sed -i s/0.0.0/$SS_VERSION/ src/environments/environment.prod.ts
RUN sed -i s/localhost/$JSCOUT_DOMAIN/ src/environments/environment.prod.ts
RUN node_modules/.bin/ng build --prod

FROM joshix/caddy:latest
COPY Caddyfile /var/www/html
COPY --from=builder /strangescout/dist/jscout /srv
EXPOSE 80 443
VOLUME /.caddy/
ENTRYPOINT ["caddy", "-agree"]
