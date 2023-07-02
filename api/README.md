# Bitgreen Carbon API

### Requirements
You need the following in order to run this API:
- Nodejs & npm
- Postgresql

### Installation
Clone this repo and install packages via npm.
```
npm install
cp .env.example .env    #create .env from example
nano .env               #enter your database info & save
```
Create DB tables, and optionally run seed script:
```
npx prisma db push
npx prisma db seed      #optional
```
Starting API server, you can define port at `.env` file. Default port is `3000`.
```
npm run start
```

To run fetcher, run the following command:
```
npm run fetcher
```

### API Docs
Check out API docs [here](https://app.swaggerhub.com/apis-docs/Bitgreen/carbon-api/).


## Docker
You can run this API in Docker containers with minimal effort as follows:  
  
### Requirements:  
Install docker and docker composer from [https://www.docker.com](https://www.docker.com)  
  
### Build and Run  
from the project folder execute:  
```
# run docker in detached mode
docker compose up -d
```
the Api Server and the Fetcher will be deployed.  

If you wish to reach the server from the public internet, please follow the Docker section in the main README.md..

To use Docker for production enviromnent you should change the POSTGRES_PASSWORD: in the docker-compose.yml
