#!/bin/bash
source "/usr/src/carbon-api-dashboard/dashboard/.env"
echo -e "0 0,6,12,18 * * * root DATABASE_URL="${DATABASE_URL}" CARBON_API="${CARBON_API}" /usr/bin/node --experimental-json-modules /usr/src/carbon-api-dashboard/dashboard/scripts/createNetworkData.mjs >> /var/log/cronjob.log 2>&1 \n" >> /etc/cron.d/cronjob
cron -f