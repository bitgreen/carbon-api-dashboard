#!/bin/bash
# SCRIPT tO get a TLS certficate from letsencrypt.org. You should have a dns record pointing to the public 
# ip address of this server.
## CHANGE THIS VARIABLES
DOMAIN="example.org"
EMAIL="info@example.org"
## END CHANGES
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
LETSENCRYPT_VOLUME_DIR=$DIR/letsencrypt


sudo docker run \
  --rm \
  --name certbot \
  -p 80:80 \
  -p 443:443 \
  -v "$LETSENCRYPT_VOLUME_DIR:/etc/letsencrypt" \
  certbot/certbot \
  certonly \
  -d $DOMAIN \
  --standalone \
  --email=$EMAIL \
  --agree-tos \
  --no-eff-email

# Copy the certificate files  to local folder and set permissions
sudo cp --recursive --dereference ./letsencrypt/live/$DOMAIN ./etc/letsencrypt/live/
sudo chown $USER:$USER --recursive ./etc/letsencrypt/live/$DOMAIN
# configure the domain name in the reverse proxy configuration
sed -i "s/example.org/$DOMAIN/g" ./nginx/conf/default.conf 
