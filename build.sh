#!/bin/bash
if git describe --tags --exact-match &> /dev/null; then
	VERSION=$(git describe --tags --exact-match)
else
	VERSION=$(git show --oneline -s | awk '{print $1;}')
fi
echo "version" $VERSION
docker-compose build --build-arg SS_VERSION=$VERSION
