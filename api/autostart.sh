#!/bin/bash
cd /usr/src/carbon-api
npx prisma db push 
npx prisma db seed 
npm run start & 
npm run fetcher