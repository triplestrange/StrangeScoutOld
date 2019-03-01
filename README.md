# StrangeScout

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![version](https://img.shields.io/github/tag-date/triplestrange/strangescout.svg?label=version&style=flat)](https://github.com/triplestrange/StrangeScout/releases/)
[![Build Status](https://travis-ci.com/triplestrange/StrangeScout.svg?branch=master)](https://travis-ci.com/triplestrange/StrangeScout)

**The world's first free software [FIRST Robotics Competition](https://firstinspires.org) scouting system powered by Docker, NodeJS, and the modern web (Angular)!**

_Brought to you by your friends at **[Triple Strange #1533](http://ecgrobotics.org)!**_

More detailed documentation can be found in the **[wiki](https://github.com/triplestrange/StrangeScout/wiki/)**

## Installation
_Excerpted from our [Deployment Guide](https://github.com/triplestrange/StrangeScout/wiki/Deployment-Guide#deploying-the-server)_

>1. **Install** [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
>2. **Install and setup** [Traefik](https://traefik.io/)
>3. **Clone this repository**
>4. **Checkout your preferred branch**
>	- `prod` for a stable and production ready system (recommended)
>	- `master` for a more recent system that may or may not have a few bugs or newer features
>5. **Install node dependencies**
>	- run `npm install --save`
>6. **Run the build program**
>	- run `node build/`
>	- If it's your first time running the build program it'll automatically prompt for configuration
>		- Set your domain
>		- Set the Traefik network you've setup
>		- Set the prefix to be used on the docker image/container and volume
>	- Select build
>		- Select existing configuration to use the existing setup, or set a new configuration
>7. **Setup an admin account**
>	- Go to `db.<your_domain.tld>/_utils/`
>	- Go to `Admin Party!` in the sidebar
>	- Create a default admin account
>8. **Create the scouting database**
>	- Still logged in to the database, create a new database with the name `ssdb`
>	- Go to the database permissions and add a member role `scouter`
>9. **Add users**
>	- Go to `<your_domain.tld>/` and login with your admin account
>	- Click on `Admin Panel`, then `Create User`
>	- Create any desired scouter and admin accounts

You're ready to scout!

**Point DNS for `<your_domain.tld>` to the IP of your server. Ensure that firewalls, AWS security groups, etc. have ports 80 and 443 open. Enjoy!**
