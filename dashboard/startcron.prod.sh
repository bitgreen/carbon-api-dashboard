#!/bin/bash

echo "*/2 * * * * root DATABASE_URL=\"postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db_dashboard:5432/${POSTGRES_DB}?schema=public\" /usr/bin/node --experimental-json-modules /usr/src/carbon-api-dashboard/dashboard/scripts/createNetworkData.mjs >> /var/log/cronjob.log 2>&1 \n" >> /etc/cron.d/cronjob

# Run cron in the background
cron -f &