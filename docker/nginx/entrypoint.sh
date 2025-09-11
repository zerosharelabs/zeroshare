#!/bin/sh
set -e

# --- CONFIG ---
DOMAIN=${DOMAIN:-yourdomain.com}
EMAIL=${EMAIL:-admin@yourdomain.com}
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
NGINX_CONF="/etc/nginx/nginx.conf"
SUPERVISOR_CONF="/etc/supervisord.conf"
DB_HOST=${DB_HOST:-database}
DB_PORT=${DB_PORT:-5432}
DB_USER=${POSTGRES_USER:-postgres}
DB_NAME=${POSTGRES_DB:-zeroshare}

# --- Wait for database to be ready ---
echo "Waiting for database to be ready..."
RETRIES=30
until nc -z $DB_HOST $DB_PORT; do
  RETRIES=$((RETRIES-1))
  if [ $RETRIES -le 0 ]; then
    echo "Database is not ready after waiting. Exiting."
    exit 1
  fi
  sleep 2
done
echo "Database is ready!"

# --- Run Prisma migrations ---
echo "Running Prisma migrations..."
cd /app/server
npm run prisma:migrate:deploy

# --- Obtain/Renew Let's Encrypt certificate ---
if [ ! -f "$CERT_PATH" ]; then
  echo "Obtaining Let's Encrypt certificate for $DOMAIN..."
  certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" -d "$DOMAIN"
else
  echo "Valid SSL certificate already exists for $DOMAIN."
fi

# --- Process Nginx template ---
NGINX_TEMPLATE="/etc/nginx/conf.d/zeroshare.conf.template"
NGINX_CONF_FINAL="/etc/nginx/conf.d/zeroshare.conf"
if [ -f "$NGINX_TEMPLATE" ]; then
  echo "Processing Nginx template for domain $DOMAIN..."
  sed "s/DOMAIN_NAME/$DOMAIN/g" "$NGINX_TEMPLATE" > "$NGINX_CONF_FINAL"
fi

# --- Start Supervisor ---
echo "Starting Supervisor..."
supervisord -c "$SUPERVISOR_CONF"
