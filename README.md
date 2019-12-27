## NOTICE!

As of July 2019, all work on the StrangeScout scouting system is now part of 1533s Red Alliance projects group, and can now be found at [https://github.com/the-red-alliance](https://github.com/the-red-alliance)

---

# StrangeScout

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![version](https://img.shields.io/github/tag-date/triplestrange/strangescout.svg?label=version&style=flat)](https://github.com/triplestrange/StrangeScout/releases/)
[![Build Status](https://travis-ci.com/triplestrange/StrangeScout.svg?branch=master)](https://travis-ci.com/triplestrange/StrangeScout)

**The world's first free software [FIRST Robotics Competition](https://firstinspires.org) scouting system powered by NodeJS and the modern web (Angular)!**

_Brought to you by your friends at **[Triple Strange #1533](http://ecgrobotics.org)!**_

More detailed documentation can be found in the **[wiki](https://github.com/triplestrange/StrangeScout/wiki/)**

## Installation

### Docker

***NOTE:*** If you don't want to use HTTPS, you can skip step 4
1. **Setup [Docker](https://www.docker.com/) on your server**
2. **Pull StrangeScout**
	- Run `docker pull team1533/strangescout:<version or 'latest'>`
3. **Create a directory to store databases and certs**
	- Run `mkdir <datadir_name>`
	- *[More Info](https://docs.docker.com/engine/reference/commandline/volume_create/)*
4. **Copy TLS certificates into data directory**
	- Copy certificate file to `<data_dir>/server.crt`
	- Copy key file to `<data_dir>/server.key`
5. **Run StrangeScout**
	- To use HTTPS, run `docker run -it -p 80:80 -p 443:443 -v <data_dir>:/opt/strangescout -e DOMAIN=<your_domain.tld> -e INTERNALIP=<internal_ip> -e USERNAME=<admin_username> -e PASSWORD=<admin_password> team1533/strangescout`
	- To run as HTTP only, run `docker run -it -p 80:80 -v <data_dir>:/opt/strangescout -e HTTPONLY=true -e DOMAIN=<your_domain.tld> -e INTERNALIP=<internal_ip> -e USERNAME=<admin_username> -e PASSWORD=<admin_password> team1533/strangescout`
	- To force the database CORS headers to use HTTPS on their origin (useful if running in HTTPONLY mode behind a reverse proxy that handles HTTPS) add `-e HTTPSCORS=true` to the docker command

### Manual

**Dependencies:** `git`, `make`, `python`, `g++`, `nodejs`, `nodejs-npm`

***NOTE:*** If you don't want to use HTTPS, you can skip step 3
1. **Clone the StrangeScout repository**
2. **Build StrangeScout**
	- Run `make`
	- If desired, one can build the docker image by running `make docker`
3. **Copy TLS certificates**
	- Copy certificate file to `./out/server.crt`
	- Copy key file to `./out/server.key`
4. **Run StrangeScout**
	- Run `node ./out/command.js -d <your_domain.tld> -i <internal_ip> -a <admin_username> -s <admin_password>`
	- If you want to use StrangeScout in HTTP only mode, append `-o`
	- If running in HTTP only mode, you can specify what port to run on by appending `-p <port>`
	*Additional options can be seen by running `node ./out/command.js --help`*

### Setup

- **Add users**
	- Go to `<your_domain.tld>/` and login with your admin account
	- Click on `Admin Panel`, then `Create User`
	- Create any desired scouter and admin accounts

You're ready to scout!

**Point DNS for `<your_domain.tld>` to the IP of your server. Ensure that firewalls, AWS security groups, etc. have ports 80 and 443 open. Enjoy!**
