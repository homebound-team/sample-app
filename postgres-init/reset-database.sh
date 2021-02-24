#!/bin/bash
set -e

# This command queries the pg_database table and generates DROP DATABASE statements
# for every database except template databases and the default postgres database.
psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres < \
    <( psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres -Atc \
        "SELECT 'DROP DATABASE \"'||datname||'\";' \
        FROM pg_database \
        WHERE datistemplate=false AND datname!='postgres';" \
    )

POSTGRES_USER=postgres . /docker-entrypoint-initdb.d/create-database.sh
