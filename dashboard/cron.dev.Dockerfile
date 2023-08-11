# pull Debian 11
FROM debian:bullseye

# install app dependencies
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl apt-utils
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs cron git coreutils postgresql-client

# copy necessery files
WORKDIR /usr/src/carbon-api-dashboard/dashboard
COPY scripts /usr/src/carbon-api-dashboard/dashboard/scripts

COPY startcron.dev.sh /usr/src/carbon-api-dashboard/dashboard/startcron.sh
RUN chmod a+x /usr/src/carbon-api-dashboard/dashboard/startcron.sh

# setup cronjob
RUN touch /etc/cron.d/cronjob
RUN chmod 0644 /etc/cron.d/cronjob
RUN touch /var/log/cronjob.log