#!/bin/bash
cd /usr/src/carbon-api-dashboard/dashboard

# Function to check if the database is ready
function check_db_ready {
  until psql -U "$POSTGRES_USER" -h db_dashboard -d "$POSTGRES_DB" -c '\q'; do
    echo "Waiting for the database to be available..."
    sleep 1
  done
}

# Wait for the database to become available
check_db_ready

npm run build
npm run start