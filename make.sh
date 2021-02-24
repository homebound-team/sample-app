#!/usr/bin/env bash
set -euo pipefail
IFS=$'\t\n'

cmd_build() {
  docker-compose build
}

cmd_start() {
	docker-compose up graphql
}

# docker-compose aliases
cmd_down() { docker-compose down; }

# Print all defined cmd_
cmd_help() {
  compgen -A function cmd_
}

if [[ $# -eq 0 ]]; then
  echo Please provide a subcommand
  exit 1
fi

SUBCOMMAND=$1
shift
set -x
cmd_${SUBCOMMAND} $@

