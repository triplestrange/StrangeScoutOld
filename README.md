# StrangeScout

*This project is fully functional, maintained, and supported. We look forward to releasing v1.0 by competition season 2019. In the meantime, check our milestones to keep up with the latest feature releases. Note that the API is not stable and compatibility isn't guaranteed until the final v1.0 release.*

[![forthebadge](https://forthebadge.com/images/badges/made-with-go.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

**The world's first free software [FIRST Robotics Competition](https://firstinspires.org) scouting system powered by Docker, Go, and the modern web (Angular2)!** Outputs data to a MariaDB database for easy access from commerical and free/libre/open-source tools such as LibreOffice Base, Tableau, Google Data Studio, and more! Authentication, web data analysis, user tracking, and more are all on the roadmap, available on the [Projects tab](https://github.com/triplestrange/StrangeScout/projects).

*Brought to you by your friends at **[Triple Strange #1533](http://ecgrobotics.org)!***

## Installation
## Docker Compose
Install [Docker](https://docs.docker.com/install/). Install [Docker Compose](https://docs.docker.com/compose/install/). Clone repo. Make a new `.env` file in the repo root (don't worry, it's in the `.gitignore`) as follows *(do not use quotes!)*:

If you want StrangeScout to talk directly to client's computers over the network (i.e. this is a dedicated server or virtual machine), run `ln -s docker-compose.standalone.yml docker-compose.yml`. If you need this server to be shared with other apps, you'll need a reverse proxy: we recommend [Traefik](https://github.com/containous/traefik). If you are using Traefik, execute `ln -s docker-compose.traefik.yml docker-compose.yml`

```
JSCOUT_DOMAIN=<yourdomain.tld>
STRANGESCOUT_SQL_PASSWD=<$ecure|)assw0rd>
# if you are using Traefik
TRAEFIK_NETWORK=<the_docker_network_traefik_is_on>
```

**Run `sudo docker-compose up -d` and sit back.** You're ready to scout... no, you're totally needed for maintenance and support and there's no way you'd have time to scout yourself right ;) HTTPS certs from Let's Encrypt and your SQL database are safely stored in Docker volumes, so you're free to start and stop containers at will, or even delete them!

**Needless to say, point DNS for `<yourdomain.tld>` to the IP of your server. Ensure that firewalls, AWS security groups, etc. have ports 80, 443, and 3306 (if you want remote SQL access) open. Enjoy!**

### Production Environment
If you want to run with the pre-built production images instead of building the latest images yourself, you must specify an additional docker compose config. this can be done by running `sudo docker-compose -f docker-compose.prod.yml up -d`

### Traefik Support
If you want to run using `traefik`, set the `PREFIX`, `MYSQL_PUBLIC_PORT`, and `TRAEFIK_NETWORK` variables in your `.env` file, abd use `sudp docker-compose -f docker-compose.traefik.yml up -d`

### Subcomponents
Use the READMEs in each subdirectory for build instructions! Have fun!

## Usage
### SQL Access
Use an off-the-shelf program like [DBeaver](https://dbeaver.io) to access your data. Choose the MariaDB database type and use `<yourdomain.tld>`, port 3306 (default), username `strangescout`, password `<$ecure|)assw0rd>`, and database `strangescout`. Works great with [Tableau](https://tableau.com) which is free for students and first teams!
