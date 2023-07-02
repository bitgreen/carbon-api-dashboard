#!/bin/bash
cd /usr/src/carbon-api-dashboard/api
npx prisma db push 
npx prisma db seed
npm run start &
npm run fetcher &
sleep 10
npm run update-networks