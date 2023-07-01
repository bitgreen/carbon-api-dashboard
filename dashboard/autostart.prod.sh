#!/bin/bash
cd /usr/src/carbon-api-dashboard/dashboard

# create db and import old db data
psql -U offsetra -h db_dashboard -d offsetra -f dump.sql --no-password
npx prisma db push

npm run build
npm run start