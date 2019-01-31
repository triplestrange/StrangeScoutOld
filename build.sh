#!/bin/bash

source $(dirname $0)/.env

if git describe --tags --exact-match &> /dev/null; then
	VERSION=$(git describe --tags --exact-match)
else
	VERSION=$(git show --oneline -s | awk '{print $1;}')
fi

echo "Build version" $VERSION "on domain" $JSCOUT_DOMAIN

docker-compose build --build-arg JSCOUT_DOMAIN=$JSCOUT_DOMAIN --build-arg SS_VERSION=$VERSION
