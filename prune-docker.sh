docker stop $(docker ps -aq --filter "name=carbon-api-dashboard")
docker rm $(docker ps -aq --filter "name=carbon-api-dashboard")
docker volume rm $(docker volume ls --filter "name=carbon-api-dashboard")
docker system prune --all --force