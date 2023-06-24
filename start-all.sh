#!/bin/bash
cd revproxy
docker-compose up -d
cd ..
docker-compose up -d --build