# JScout

The modern web frontend to [StrangeScout](https://github.com/strangescout).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.7.

## Docker Building
Clone the repository to your server. Change to the `jscout` directory (this one). Run `docker build -t jscout .` to build this directory into an image called `jscout` on the local image store. To avoid hitting Let's Encrypt rate limits (not fun), make sure to create a Docker volume to store the `.caddy` folder that holds your certificates safe across containers: run `docker volume create jscout-caddy` Then use the following `docker run` command to start up the JScout container:

```bash
sudo docker run -d -e "JSCOUT_DOMAIN=<yourdomain.tld>" \
  -e "JSCOUT_LETS_ENCRYPT_EMAIL=<user@yourdomain.tld>" \
  -v jscout-caddy:/.caddy  -p 80:80 -p 443:443 jscout
```

**Make sure that ports 80 and 443 are open to the public on the host machine and that `<yourdomain.tld>`, `<www.yourdomain.tld>`, and `<api.yourdomain.tld>` all point to the IP of your host.** If you prefer to terminate SSL elsewhere, simple edit the [Caddyfile](https://caddyserver.com/docs/tls) and rebuild the container.

## Manual Building
### Toolchain
**[Install NPM](https://www.npmjs.com/get-npm), run `npm install --save', use your shiny not-so-new local verion of theAngular CLI!** This is almost certaintly older than your global version of Angular CLI so make sure to do this or it won't even find the config file.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
