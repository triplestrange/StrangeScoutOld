FROM alpine AS builder
ARG SS_VERSION
WORKDIR /strangescout
RUN apk add --update python make g++ nodejs nodejs-npm
COPY ./ ./
RUN sed -i s/0.0.0/$SS_VERSION/ src/environments/environment.prod.ts
RUN sed -i s/localhost/$JSCOUT_DOMAIN/ src/environments/environment.prod.ts
RUN npm install -g @angular/cli
RUN npm update --save
RUN ng build --prod

FROM joshix/caddy:latest
COPY Caddyfile /var/www/html
COPY --from=builder /strangescout/dist/jscout /srv
EXPOSE 80 443
VOLUME /.caddy/
ENTRYPOINT ["caddy", "-agree"]
