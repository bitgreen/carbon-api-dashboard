# pull Debian 11
FROM debian:bullseye

# install app dependencies
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl apt-utils
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get -y install git cron
WORKDIR /usr/src/
RUN git clone https://github.com/bitgreen/carbon-api-dashboard.git
WORKDIR /usr/src/carbon-api-dashboard/dashboard
RUN npm install -g npm@9.7.1
RUN /usr/bin/npm install
COPY .env.Docker /usr/src/carbon-api-dashboard/dashboard/.env
COPY autostart.sh /usr/src/carbon-api-dashboard/dashboard/autostart.sh
COPY scripts/createNetworkData.mjs /usr/src/carbon-api-dashboard/dashboard/scripts/createNetworkData.mjs
RUN chmod a+x /usr/src/carbon-api-dashboard/dashboard/autostart.sh
COPY cronjob /etc/cron.d/cronjob
RUN chmod 0644 /etc/cron.d/cronjob
# final configuration
EXPOSE 3000
ENV DATABASE_URL="postgresql://offsetra:69542068ef65466a1c@db_dashboard:5432/offsetra?schema=public"
ENV CARBON_API="http://api:3000"