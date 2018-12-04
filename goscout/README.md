# GoScout

**WARNING: This document is here for historical purposes only and is not being maintained. The instructions contained within may or may not function as intended.**

[StrangeScout](https://github.com/strangescout) API backend.

## Building and Deploying with Docker
Thanks to the magic of Docker, GoScout is easier than ever to deploy. First, clone the StrangeScout repository to your server. Change to the `goscout` directory (this one). Run `docker build -t strangescout_goscout .` to build this directory into an image called `strangescout_goscout` on the local image store. Then use the following `docker run` command to start up the GoScout container:

```bash
sudo docker run -d -e "GOSCOUT_SQL_USER=<username>" \
  -e "GOSCOUT_SQL_PASSWD=<password>" \
  -e "GOSCOUT_SQL_HOST=<dbserver>" \
  -p 15338:15338 strangescout_goscout
```

**Make sure that port `15338` is accessible to API clients (ex. JScout). Make sure that a MariaDB/MySQL database is accessible from [within the container](https://docs.docker.com/articles/networking/) on port 3306 or another port you specify. The easiest way to do this is with a Docker network and the SQL server running in an off-the-shelf container on the same network as GoScout.** GoScout does not terminate SSL and is not currently intended for Internet use. For example, JScout functions as a reverse proxy, terminating SSL and making GoScout available to its client via the `/api` path over HTTPS.
