# StrangeScout

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[![forthebadge](https://forthebadge.com/images/badges/made-with-go.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)

**The world's first free software [FIRST Robotics Competition](https://firstinspires.org) scouting system powered by Docker, Go, and the modern web (Angular)!** Outputs data to a MariaDB database for easy access from commerical and free/libre/open-source tools such as LibreOffice Base, Tableau, Google Data Studio, and more!

_Brought to you by your friends at **[Triple Strange #1533](http://ecgrobotics.org)!**_

More detailed documentation can be found in the **[wiki](https://github.com/triplestrange/StrangeScout/wiki/)**

## Installation
_Excerpted from our [Deployment Guide](https://github.com/triplestrange/StrangeScout/wiki/Deployment-Guide#deploying-the-server)_

>1. **Install** [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
>2. **Clone this repository**
>3. **Checkout your preferred branch**
>	- `prod` for a stable and production ready system (recommended)
>	- `master` for a more recent system that may or may not have a few bugs or newer features
>4. **Choose your preferred method**
>	- For standalone deployment, do `ln -s docker-compose.standalone.yml docker-compose.yml`
>	- If you want to use `Traefik`, the reverse proxy we support, do `ln -s docker-compose.traefik.yml docker-compose.yml`
>5. **Create your `.env` file with the following vars:**
>	```
>		JSCOUT_DOMAIN=<your_domain.tld> # set the domain you're hosting your scouting service on
>		STRANGESCOUT_SQL_PASSWD=<secret_password1533> # password to access the MySQL database
>		GOSCOUT_EVENT_HARDCODE=<event_currently_scouting> # what event you're currently scouting
>	```
>	- Optional vars:
>	```
>		MYSQL_PUBLIC_PORT=<1533> # set if you'd like to use a SQL port other than the default of 3306
>		PREFIX=<dev> # set if you'd like to set a prefix for the docker images (defaults to prod if not set)
>	```
>	- If you're using `traefik`, also set the `TRAEFIK_NETWORK` var
>6. **Run `./build.sh`**
>7. **Do `docker-compose up -d`** 

You're ready to scout! HTTPS certs from Let's Encrypt (if you're using the standalone install) and your SQL database are safely stored in Docker volumes, so you're free to start and stop containers at will, or even delete them!

**Point DNS for `<your_domain.tld>` to the IP of your server. Ensure that firewalls, AWS security groups, etc. have ports 80 and 443 open, as well as 3306 (or whatever you've manually set it to) for SQL. Enjoy!**

## Usage

### SQL Access
Use an off-the-shelf program like [DBeaver](https://dbeaver.io) to access your data. Choose the MariaDB database type and use `<your_domain.tld>`, port 3306 (default), username `strangescout`, password `<secret_password1533>`, and database `strangescout`. **StrangeScout** works great with [Tableau](https://tableau.com) which is free for students and first teams!
