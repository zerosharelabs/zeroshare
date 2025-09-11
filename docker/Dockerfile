
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./ 
RUN npm ci 
COPY frontend/ ./
RUN npm run build
    
# --- Server build stage ---
FROM node:20-alpine AS build-server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# --- Final production image ---
FROM node:20-alpine
RUN apk add --no-cache openssl bash curl nginx certbot supervisor certbot-nginx
RUN mkdir -p /app/server /app/frontend /etc/nginx /usr/share/nginx/html /etc/letsencrypt /var/log/supervisor
WORKDIR /app

# Copy built server and frontend
COPY --from=build-server /app/server/build /app/server/build
COPY --from=build-server /app/server/package*.json /app/server/
COPY --from=build-server /app/server/prisma /app/server/prisma

COPY --from=build-frontend /app/frontend /app/frontend
COPY --from=build-frontend /app/frontend/.next /app/frontend/.next
COPY --from=build-frontend /app/frontend/public /app/frontend/public
COPY --from=build-frontend /app/frontend/package*.json /app/frontend/

# Copy Nginx config
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/zeroshare.conf.template /etc/nginx/conf.d/zeroshare.conf.template
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint and supervisor config
COPY docker/nginx/entrypoint.sh /entrypoint.sh
COPY docker/nginx/supervisord.conf /etc/supervisord.conf
RUN chmod +x /entrypoint.sh

# Install only production dependencies for server
WORKDIR /app/server
RUN npm ci --omit=dev

# Install only production dependencies for frontend
WORKDIR /app/frontend
RUN npm ci --omit=dev

# Expose ports
EXPOSE 80 443

# VOLUME for SSL certificates
VOLUME ["/etc/letsencrypt"]

# Health check for backend
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3030/health || exit 1

# Entrypoint runs supervisor
ENTRYPOINT ["sh", "/entrypoint.sh"]
