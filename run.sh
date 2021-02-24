#!/bin/bash

#if [ "${STAGE}" = "" ]; then
#  # if no stage is set, default to loading test env file
#  export $(grep -v '^#' ./env/test.env | sed 's/\"/\\\"/g' | xargs)
#elif [ "${ZONE_NAME}" = "" ]; then
#  # if stage is set, but the rest of env isn't loaded then load env file with $STAGE's name
#  export $(grep -v '^#' "./env/$STAGE.env" | sed 's/\"/\\\"/g' | xargs)
#fi

./node_modules/.bin/ts-node -C ttypescript "$@"
