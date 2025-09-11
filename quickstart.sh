#!/bin/bash

# Quickstart script for ZeroShare production setup
set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art
printf "${YELLOW}"
cat <<'EOF'

███████╗███████╗██████╗░░█████╗░░██████╗██╗░░██╗░█████╗░██████╗░███████╗
╚════██║██╔════╝██╔══██╗██╔══██╗██╔════╝██║░░██║██╔══██╗██╔══██╗██╔════╝
░░███╔═╝█████╗░░██████╔╝██║░░██║╚█████╗░███████║███████║██████╔╝█████╗░░
██╔══╝░░██╔══╝░░██╔══██╗██║░░██║░╚═══██╗██╔══██║██╔══██║██╔══██╗██╔══╝░░
███████╗███████╗██║░░██║╚█████╔╝██████╔╝██║░░██║██║░░██║██║░░██║███████╗
╚══════╝╚══════╝╚═╝░░╚═╝░╚════╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝
EOF
printf "${NC}"

# Friendly intro
printf "${YELLOW}\nWelcome to the ZeroShare Production Quickstart!\n${NC}"
printf "${YELLOW}\nThis script will set up your environment and Docker configuration for a secure production deployment.\n${NC}"
printf "${YELLOW}\nNo input required. Default values will be used for all settings.\n${NC}"

# Default values
DOMAIN="zeroshare.io"
EMAIL="ssl@zeroshare.io"
SMTP_HOST="mail.smtp2go.com"
SMTP_PORT="587"
SMTP_USER="zeroshare.io"
SMTP_PASSWORD=$(openssl rand -hex 16)

# Generate random secrets
generate_secret() {
  openssl rand -hex 32
}

env_file=".env"
if [ ! -f "$env_file" ]; then
  printf "${YELLOW}\nGenerating .env file with secrets...\n${NC}"
  ENCRYPTION_KEY=$(generate_secret)
  ARGON2_SECRET=$(generate_secret)
  BETTER_AUTH_SECRET=$(generate_secret)
  POSTGRES_PASSWORD=$(generate_secret)
  POSTGRES_USER=zeroshare
  POSTGRES_DB=zeroshare
  BETTER_AUTH_URL="https://$DOMAIN"
  cat <<EOF > $env_file
# ZeroShare Production Environment
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@database:5432/$POSTGRES_DB
ENCRYPTION_KEY=$ENCRYPTION_KEY
ARGON2_SECRET=$ARGON2_SECRET
BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
BETTER_AUTH_URL=$BETTER_AUTH_URL
DOMAIN=$DOMAIN
EMAIL=$EMAIL
POSTGRES_DB=$POSTGRES_DB
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASSWORD=$SMTP_PASSWORD
EOF
  printf "${YELLOW}\n.env file created with random secrets. Please review and update non-secret values as needed.\n${NC}"
else
  printf "${YELLOW}\n.env file already exists. Skipping creation.\n${NC}"
fi

docker_compose_target="docker-compose.yml"

if [ ! -f "$docker_compose_target" ]; then
  printf "${YELLOW}\nGenerating docker-compose.yml for production...\n${NC}"
  cat <<EOF > $docker_compose_target
services:
  zeroshare:
    image: ghcr.io/zerosharelabs/zeroshare:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      ARGON2_SECRET: ${ARGON2_SECRET}
      DOMAIN: ${DOMAIN}
      EMAIL: ${EMAIL}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      BETTER_AUTH_TELEMETRY: 0
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - zeroshare_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ssl_certificates:/etc/letsencrypt

  database:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - zeroshare_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  ssl_certificates:
    driver: local
  postgres_data:
    driver: local
networks:
  zeroshare_network:
    driver: bridge
EOF
  printf "${YELLOW}\ndocker-compose.yml for production created.\n${NC}"
else
  printf "${YELLOW}\ndocker-compose.yml already exists. Skipping creation.\n${NC}"
fi

printf "${YELLOW}\nRun 'docker compose up -d' to start ZeroShare in production mode.\n${NC}"

# Thank you and call to action
printf "${YELLOW}\nThank you for using ZeroShare!\n${NC}"
printf "${YELLOW}If you like this project, please consider starring us on GitHub: https://github.com/zerosharelabs/zeroshare\n${NC}"
printf "${YELLOW}Or support development with a donation!\n${NC}"
printf "${YELLOW}Have a great and secure day!\n${NC}"

docker_compose_target="docker-compose.yml"

if [ ! -f "$docker_compose_target" ]; then
  printf "${CYAN}Generating docker-compose.yml for production...${NC}\n"
  cat <<EOF > $docker_compose_target
services:
  zeroshare:
    image: ghcr.io/zerosharelabs/zeroshare:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: [4m${DATABASE_URL}[24m
      ENCRYPTION_KEY: [4m${ENCRYPTION_KEY}[24m
      ARGON2_SECRET: [4m${ARGON2_SECRET}[24m
      DOMAIN: [4m${DOMAIN}[24m
      EMAIL: [4m${EMAIL}[24m
      BETTER_AUTH_SECRET: [4m${BETTER_AUTH_SECRET}[24m
      BETTER_AUTH_URL: [4m${BETTER_AUTH_URL}[24m
      BETTER_AUTH_TELEMETRY: 0
      SMTP_HOST: [4m${SMTP_HOST}[24m
      SMTP_PORT: [4m${SMTP_PORT}[24m
      SMTP_USER: [4m${SMTP_USER}[24m
      SMTP_PASSWORD: [4m${SMTP_PASSWORD}[24m
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - zeroshare_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ssl_certificates:/etc/letsencrypt

  database:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=[4m${POSTGRES_DB}[24m
      - POSTGRES_USER=[4m${POSTGRES_USER}[24m
      - POSTGRES_PASSWORD=[4m${POSTGRES_PASSWORD}[24m
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - zeroshare_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  ssl_certificates:
    driver: local
  postgres_data:
    driver: local
networks:
  zeroshare_network:
    driver: bridge
EOF
  printf "${GREEN}docker-compose.yml for production created.${NC}\n"
else
  printf "${YELLOW}docker-compose.yml already exists. Skipping creation.${NC}\n"
fi

printf "${CYAN}Run '${GREEN}docker compose up -d${CYAN}' to start ZeroShare in production mode.${NC}\n\n"

# Thank you and call to action
printf "${GREEN}Thank you for using ZeroShare!${NC}\n"
printf "${YELLOW}If you like this project, please consider starring us on GitHub:${NC} ${CYAN}https://github.com/zerosharelabs/zeroshare${NC}\n"
printf "${YELLOW}Or support development with a donation!${NC}\n"
printf "${CYAN}Have a great and secure day!${NC}\n"