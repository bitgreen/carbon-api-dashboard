#!/bin/bash
rm -rf ./letsencrypt/*
rm -rf ./etc/letsencrypt/live/*
cp ./nginx/default.conf ./nginx/conf/
echo "certificates and private keys wiped"
