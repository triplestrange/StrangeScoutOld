FROM golang:latest AS builder
ARG SQL_SRV
WORKDIR /goscout
COPY ./ ./
RUN go get -d -v ./...
RUN go build -v -ldflags "-X main.server=$SQL_SRV -linkmode external -extldflags -static" -o GoScout -a main.go

FROM scratch
COPY --from=builder /goscout/GoScout .
EXPOSE 80 443 9005
ENTRYPOINT ["/GoScout"]
