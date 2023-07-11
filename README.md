## Carbon Dashboard - Green Polkadot  
  
https://greenpolkadot.io/  
  
A dashboard monitoring the energy usage and carbon emissions of the Polkadot ecosystem.   
Providing real-time updates for anyone to explore the relaychain and various parachains.  

The documentation is in  the [folder dashboard](/dashboard)  

## Carbon Api  
  
The api offers some API regarding carbon offset (TODO description).  
Specific documentation is in  the [folder api](/api)  

## Docker
You can run the Dashboard and the Api in Docker. 
The Dashboard will be reachable on port 3000, for example with http://localhost:3000.  
The API will be reachable on port 3001, for example with http://localhost:3001.  
  
If you wish to use docker for production enviromnent you should change the POSTGRES_PASSWORD: in the docker-compose.yml in both folder "api" and "dashboard", and Run a docker for a reverse proxy as follows:  

## Reverse Proxy

- Requirements:
Docker, Docker Compose, Linux Os.

- Installation:
Point a sub or full domain name to the public ip adress of your server.  
  
change folder to revproxy:  
```bash
cd revproxy
```
edit the file install.sh and change the value of DOMAIN and EMAIL to yours.  
Execute the install.sh:  
```bash
./install.sh
```
Check the result, you should have installed a valid TLS certificate from Letsencrypt.org.  
You can wipe the certificates and private key with:  
Execute the install.sh:  
```bash
./clean.sh
```  
For any issue the docker certbot will outout clear error messages and possible solutions.
run the docker image for the reverse proxy with:
```bash
docker compose up -d
```
The reverse proxy will forward the TLS connections the internal API and Dashboard.  
You should run the docker for the Dashboard and API and test them browsing to:  
https;//YOURDOMAIN/ for the dashboard.  
https://YOURDOMAIN/api for the api.  

# Production Run
To run all the docker images in production, first make sure you have db dumps for both api and dashboard projects.
They should be located at `api/dump.sql` and `dashboard/dump.sql`. Once you have dumps at correct paths, you can safely run the following command:
```bash
./start-all.sh
```

# Development Run
To run all the docker images in development:
```bash
./start-all.dev.sh
```
### Notes:
- It takes about 5 minutes to get everything up and running, so please wait a bit once you run the command.
- In dev environment, cron job will run every 2 minutes (every 6h in production)

## Prune Docker files
In case you want to prune all containers and it's data, you can run the following script:
```bash
./prune-docker.sh
```