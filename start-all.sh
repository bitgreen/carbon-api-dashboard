#!/bin/bash
cd revproxy
docker compose up -d
cd ..
docker compose -f docker-compose.yml up -d --build