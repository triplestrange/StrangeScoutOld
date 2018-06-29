FROM alpine AS builder
WORKDIR /strangescout
RUN apk add --update nodejs nodejs-npm
COPY ./ ./
RUN npm install --save
RUN ./node_modules/@angular/cli/bin/ng build

FROM joshix/caddy
COPY Caddyfile /var/www/html
COPY --from=builder /strangescout/dist /var/www/html
EXPOSE 443 80 8080
