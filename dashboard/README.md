## Bitgreen Dashboard

https://greenpolkadot.io/

A dashboard monitoring the energy usage and carbon emissions of the Polkadot ecosystem. Providing real-time updates for anyone to explore the relaychain and various parachains.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Emission analysis is conducted through aggregation of geolocation, grid efficiency and average compuatation data provided by parachain operators.

Update DATABASE_URL in .env to connect your postgres database

To set up the cron job, provide Github secrets with the relevant POSTGRES_PASSWORD and DATABASE_URL
OR you can setup cron job by yourself:
`crontab -e`
```
0 0,6,12,18 * * * node --experimental-json-modules /path/to/scripts/createNetworkData.mjs
```

To ensure robust database security throughout the dashboard, /api/ endpoints are passed down through getStaticProps, Prisma is never directly used on the client, all database interactions happen using server-side NodeJS code. To prevent reentrancy attacks, a random nonce is generated and signed each time parachain/DApp information is updated.

## Docker

You can run this Dashboard in  Docker containers with minimal effort as follows:  

### Requirements:  
Install docker and docker composer from [https://www.docker.com](https://www.docker.com)  

### Build and Run  
From the project folder execute: 
You can run the server in a docker container executing the following command from the
project folder:  

```
docker compose up -d
```
Please wait for a few minutes to let the server populate some records in the
database.  
The server will be reachable browsing http://localhost:3001  

If you wish to reach the server from the public internet, please follow the Docker section in the [main README.md.](../README.md).

  
This is a [Next.js](https://nextjs.org/) project developed by [Offsetra](https://offsetra.com/).


