FROM node:11-alpine
WORKDIR /strangescout
RUN apk add --update bash nodejs
RUN mkdir /opt/strangescout
COPY ./docker/entrypoint.sh ./
COPY ./out/ ./
EXPOSE 80 443
ENTRYPOINT ["./entrypoint.sh"]