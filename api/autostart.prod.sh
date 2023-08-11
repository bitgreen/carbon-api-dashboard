#!/bin/bash
cd /usr/src/carbon-api-dashboard/api

# Function to check if the database is ready
function check_db_ready {
  until psql -U "$POSTGRES_USER" -h db_api -d "$POSTGRES_DB" -c '\q'; do
    echo "Waiting for the database to be available..."
    sleep 5
  done
}

# Wait for the database to become available
check_db_ready

npx prisma generate
npm run fetcher &
sleep 10
npm run update-networks
npm run start