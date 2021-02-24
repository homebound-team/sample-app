FROM postgres:10.14

ARG TEST_PARALLELISM
ENV TEST_PARALLELISM=${TEST_PARALLELISM:-8}

# These scripts are only run once on initial db creation; if you need to re-run, use `docker-compose rm db`.
COPY ./postgres-init/create-database.sh /docker-entrypoint-initdb.d/
COPY ./postgres-init/reset-database.sh /
COPY ./postgres-init/console.sh /
