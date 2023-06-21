#!/bin/bash
cd revproxy
docker-compose up -d
cd ../api
docker-compose up -d
cd ../dashboard
docker-compose up -d
