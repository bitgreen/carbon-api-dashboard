# syntax=docker/dockerfile:1
FROM debian:bullseye

# install app dependencies
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl apt-utils
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get -y install git
RUN apt-get -y install coreutils

WORKDIR /usr/src/
RUN git clone https://github.com/bitgreen/carbon-api.git 
WORKDIR /usr/src/carbon-api
RUN npm install -g npm@9.7.1
RUN /usr/bin/npm install
COPY .env.Docker /usr/src/carbon-api/.env
COPY autostart.sh /usr/src/carbon-api/
RUN chmod a+x /usr/src/carbon-api/autostart.sh
# final configuration
EXPOSE 3000
EXPOSE 22
ENV DATABASE_URL="postgresql://carbonapi:69542068ef65466a1c@db:5432/carbonapi?schema=public"
ENV API_PORT=3000
ENV TZ="UTC"
CMD "/usr/src/carbon-api/autostart.sh"

