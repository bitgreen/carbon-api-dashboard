#!/bin/bash
cd /usr/src/carbon-api-dashboard/dashboard
npx prisma db push --accept-data-loss
node --experimental-json-modules /usr/src/carbon-api-dashboard/dashboard/scripts/createNetworkData.mjs
npm run dev