#! /bin/sh
export NODE_ENV="TEST"
npm run test:cov
PGUSER="pguser"
PGPASS="pgpassword"
PGDB="sthore_test"

docker exec -i -t pgsql psql postgres -U pguser -c "CREATE DATABASE sthore_test"
npm run test:e2e
docker exec -i -t pgsql psql postgres -U pguser -c "DROP DATABASE sthore_test"