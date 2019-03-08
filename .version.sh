#!/bin/bash

if git describe --tags --exact-match > /dev/null 2>&1; then
	VERSION=$(git describe --tags --exact-match)
else
	VERSION=$(git show --oneline -s | awk '{print $1;}')
fi

echo $VERSION
