#!/bin/bash
cd /usr/src/carbon-api-dashboard/api

# create db and import old db data
psql -U carbonapi -h db_api -d carbonapi -f dump.sql --no-password
npx prisma db push
npx prisma db seed

npm run start &
npm run fetcher &
sleep 10
npm run update-networks