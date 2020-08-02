#! /bin/sh
export NODE_ENV="TEST"
npm run test:cov
export PGUSER="pguser"
export PGPASS="pgpassword"
export PGDB="sthore_test"

docker exec -i pgsql psql postgres -U pguser -c "CREATE DATABASE sthore_test"
npm run test:e2e
docker exec -i pgsql psql postgres -U pguser -c "DROP DATABASE sthore_test"