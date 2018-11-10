FROM golang:latest AS builder
WORKDIR /goscout
COPY ./ ./
RUN go get -d -v ./...
RUN go build -v -ldflags "-linkmode external -extldflags -static" -o GoScout -a src/main.go src/struct.go src/utils.go src/indexes.go src/queries.go

FROM alpine
COPY --from=builder /goscout/GoScout .
RUN apk add --update bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh wait-for-it.sh
EXPOSE 15338
ENTRYPOINT ["bash", "./wait-for-it.sh", "strangedb:3306", "--timeout=0", "--", "/GoScout"]
