FROM node:11-alpine
WORKDIR /strangescout
RUN apk add --update bash python make g++
RUN mkdir /opt/strangescout
COPY ./docker/entrypoint.sh ./
COPY ./out/ ./
RUN npm rebuild
RUN apk del python make g++
EXPOSE 80 443
ENTRYPOINT ["./entrypoint.sh"]