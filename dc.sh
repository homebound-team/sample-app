#!/usr/bin/env bash
set -euo pipefail
IFS=$'\t\n'

# These are all commands/aliases that assume you want to do things with docker.
# I.e. the regular package.json scripts entries can be invoked directly to run
# things outside of docker.
#
# Based on https://github.com/dryewo/make-sh

cmd_db() {
	docker-compose up db-wait
	npm run migrate
}

cmd_build() {
  docker-compose build
}

cmd_graphql() {
	docker-compose up graphql
}

# docker-compose aliases
cmd_down() { docker-compose down; }

# Print all defined cmd_
cmd_help() { compgen -A function cmd_; }

if [[ $# -eq 0 ]]; then
  echo Please provide a subcommand
  exit 1
fi

SUBCOMMAND=$1
shift
set -x
cmd_${SUBCOMMAND} "$@"

