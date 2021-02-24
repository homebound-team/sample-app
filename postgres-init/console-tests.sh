#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username homebound --dbname homebound_tests_1 "$@"
