#!/bin/bash
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

# Default values
env_file=".env"
DOMAIN="zeroshare.io"
EMAIL="ssl@zeroshare.io"
SMTP_HOST="mail.smtp2go.com"
SMTP_PORT="587"
SMTP_USER="zeroshare.io"


# Function to generate a random secret
generate_secret() {
  openssl rand -hex 32
}

# Create .env file with secrets
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
SMTP_PASSWORD=$(openssl rand -hex 16)
EOF
  printf "${YELLOW}\n.env file created. Please review and update values as needed.\n${NC}"
else
  printf "${YELLOW}\n.env file already exists. Skipping creation.\n${NC}"
fi

# Download docker-compose.prod.yml and save as docker-compose.yml
docker_compose_url="https://raw.githubusercontent.com/zerosharelabs/zeroshare/refs/heads/main/docker/docker-compose.prod.yml"
docker_compose_target="docker-compose.yml"
if [ ! -f "$docker_compose_target" ]; then
  printf "${YELLOW}\nDownloading docker-compose.yml...\n${NC}"
  curl -fsSL "$docker_compose_url" -o "$docker_compose_target"
  printf "${YELLOW}\ndocker-compose.yml saved.\n${NC}"
else
  printf "${YELLOW}\ndocker-compose.yml already exists. Skipping download.\n${NC}"
fi

printf "${YELLOW}\nThank you for using ZeroShare!\n${NC}"