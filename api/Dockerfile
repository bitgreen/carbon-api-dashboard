# syntax=docker/dockerfile:1
FROM debian:bullseye

# install app dependencies
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl apt-utils
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs git coreutils postgresql-client

WORKDIR /usr/src/
RUN git clone https://github.com/bitgreen/carbon-api-dashboard.git
WORKDIR /usr/src/carbon-api-dashboard/api
RUN npm install -g npm@9.7.1
RUN /usr/bin/npm install

# copy necessery files
COPY .env.Docker /usr/src/carbon-api-dashboard/api/.env
COPY autostart.prod.sh /usr/src/carbon-api-dashboard/api/autostart.sh
RUN chmod a+x /usr/src/carbon-api-dashboard/api/autostart.sh
COPY fetcher.js /usr/src/carbon-api-dashboard/api/fetcher.js

# final configuration
EXPOSE 3000
EXPOSE 22