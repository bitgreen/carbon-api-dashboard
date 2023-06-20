# pull Debian 11
FROM debian:bullseye

# install app dependencies
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl apt-utils
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get -y install git cron 
WORKDIR /usr/src/
RUN git clone https://github.com/bitgreen/carbon-dashboard.git 
WORKDIR /usr/src/carbon-dashboard
RUN npm install -g npm@9.7.1
RUN /usr/bin/npm install
COPY .env.Docker /usr/src/carbon-dashboard/.env
COPY autostart.sh /usr/src/carbon-dashboard/autostart.sh
RUN chmod a+x /usr/src/carbon-dashboard/autostart.sh
# final configuration
EXPOSE 3000
WORKDIR /usr/src/carbon-dashboard
CMD "/usr/src/carbon-dashboard/autostart.sh"


