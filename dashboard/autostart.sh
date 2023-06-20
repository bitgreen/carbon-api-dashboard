#!/bin/bash 
cd /usr/src/carbon-dashboard
npx prisma db push --accept-data-loss 
node --experimental-json-modules /usr/src/carbon-dashboard/scripts/createNetworkData.mjs
crontab </usr/src/carbon-dashboard/crontab.log
npm run dev
