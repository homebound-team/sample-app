#!/bin/bash

if [ "${STAGE}" = "" ]; then
  # if no stage is set, default to loading test env file
  export $(grep -v '^#' ./env/test.env | sed 's/\"/\\\"/g' | xargs)
elif [ "${DB_DATABASE}" = "" ]; then
  # if stage is set, but the rest of env isn't loaded then load env file with $STAGE's name
  export $(grep -v '^#' "./env/$STAGE.env" | sed 's/\"/\\\"/g' | xargs)
fi

export DATABASE_CONNECTION_INFO="{\"host\":\"$DB_HOST\",\"port\":$DB_PORT,\"username\":\"$DB_USER\",\"password\":\"$DB_PASSWORD\",\"dbname\":\"$DB_DATABASE\"}"

./node_modules/.bin/ts-node -C ttypescript "$@"
