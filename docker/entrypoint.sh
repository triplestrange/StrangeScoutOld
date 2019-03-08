#!/bin/bash

if [ "$HTTPONLY" = true ] ; then
	echo "HTTPONLY"
	node ./command.js -d $DOMAIN -P /opt/strangescout -o
else
	node ./command.js -d $DOMAIN -P /opt/strangescout -k /opt/strangescout/server.key -c /opt/strangescout/server.crt
fi
