#!/bin/bash
cd /usr/src/carbon-api-dashboard/dashboard
npx prisma db push
npm run build
npm run start
crontab /usr/src/carbon-api-dashboard/dashboard/crontab.log
