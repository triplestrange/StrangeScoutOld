# StrangeScout

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
![version](https://img.shields.io/github/tag-date/triplestrange/strangescout.svg?label=version&style=flat)

**The world's first free software [FIRST Robotics Competition](https://firstinspires.org) scouting system powered by Docker, CouchDB, and the modern web (Angular)!**

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
>		STRANGESCOUT_DB_PASSWD=<secret_password1533> # password to access the CouchDB database
>	```
>	- Optional vars:
>	```
>		PREFIX=<dev> # set if you'd like to set a prefix for the docker images (defaults to prod if not set)
>	```
>	- If you're using `traefik`, also set the `TRAEFIK_NETWORK` var
>	- If you're using a standalone install, also set the `JSCOUT_LETS_ENCRYPT_EMAIL` var
>		- This specifies the email used to get Lets Encrypt certificates for HTTPS support
>6. **Run `./build.sh`**
>7. **Do `docker-compose up -d`**
>8. **Configure CouchDB**
>	- Go to `<your_domain.tld>/cdb/_utils/index.html` and login with the username `strangescout` and password you set
>	- Go to `Setup` in the sidebar and select `Configure Single Node`
>	- Enter the same credentials you used above and click `Configure Node`
>9. **Create the scouting database**
>	- Still logged in to the database, create a new database with the name `ssdb`
>	- Go to the database permissions and add a member role `scouter`
>10. **Add scouter users**
>	- A good explanation for adding users can be found at [https://stackoverflow.com/a/6418670](https://stackoverflow.com/a/6418670)
>	- Don't forget to set the `scouter` role so the users can interact with the database!

You're ready to scout! HTTPS certs from Let's Encrypt (if you're using the standalone install) and your SQL database are safely stored in Docker volumes, so you're free to start and stop containers at will, or even delete them!

**Point DNS for `<your_domain.tld>` to the IP of your server. Ensure that firewalls, AWS security groups, etc. have ports 80 and 443 open, as well as 5984 if you want direct access to CouchDB. Enjoy!**

## Usage

### CouchDB Access
CouchDB comes with the very user friendly Fauxton Web UI. Just point your browser to `<your_domain.tld>/cdb/_utils/index.html` and sign in with username `strangescout` and the password `<secret_password1533>` you set in your .env file.
