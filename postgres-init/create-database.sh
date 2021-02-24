#!/bin/bash
set -e

DATABASES=(
    'homebound'         # used for graphql service
)

# Create `n` test databases (where `n` is the test parallelism used on any given machine).
for ((i=1; i<TEST_PARALLELISM + 1; i++)); do
    DATABASES+=("homebound_tests_$i")
done

function generate_create_db_statements() {
    local statements="";
    for db in "${DATABASES[@]}"; do
        statements+="
            CREATE DATABASE $db;
            GRANT ALL PRIVILEGES ON DATABASE $db TO homebound;
        "
    done
    echo "$statements";
}

function generate_install_citext_statements() {
    for db in "${DATABASES[@]}"; do
      statements+="
          \c $db;
          CREATE EXTENSION "citext";
      "
    done
    echo "$statements";
}

# This initializes our initial database(s), user/password, and any modules.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DROP USER IF EXISTS homebound;
    CREATE USER homebound PASSWORD 'local';

    $(generate_create_db_statements)
    $(generate_install_citext_statements)
EOSQL
