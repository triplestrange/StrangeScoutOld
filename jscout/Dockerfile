FROM alpine AS builder
WORKDIR /strangescout
RUN apk add --update nodejs nodejs-npm
COPY ./ ./
RUN npm install -g @angular/cli
RUN npm update --save
RUN ls -la ./node_modules
RUN ng build -prod

FROM abiosoft/caddy:latest
ENV CADDYPATH=/etc/caddypath
COPY config/Caddyfile /etc/Caddyfile
COPY --from=builder /strangescout /srv
EXPOSE 80 443
VOLUME /etc/caddypath
ENTRYPOINT caddy -agree
