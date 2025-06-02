# Use the official n8n image with a specific version for stability
FROM n8nio/n8n:latest

# Set environment variables
ENV NODE_ENV=production
ENV N8N_PORT=5678
# ENV N8N_PROTOCOL=http
ENV GENERIC_TIMEZONE=UTC
ENV N8N_USER_FOLDER=/home/node/.n8n

# Security configurations
# ENV N8N_ENCRYPTION_KEY=your-strong-encryption-key-here
ENV N8N_DIAGNOSTICS_ENABLED=false
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# Basic Auth (recommended for production)
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=passwd

# Webhook configuration
# ENV WEBHOOK_URL=https://your-domain.com/

# Database configuration (using SQLite by default)
# ENV DB_TYPE=sqlite
# ENV DB_SQLITE_VACUUM_ON_STARTUP=true

# Execution settings
ENV EXECUTIONS_PROCESS=main
ENV EXECUTIONS_TIMEOUT=3600
ENV EXECUTIONS_TIMEOUT_MAX=10800

# Volume configuration
VOLUME /home/node/.n8n

# Expose the default n8n port
EXPOSE 5678

# Health check
# HEALTHCHECK --interval=5m --timeout=30s \
#   CMD curl -f http://localhost:5678/rest/health || exit 1

# FROM n8nio/n8n:latest
# EXPOSE 5678
# CMD ["n8n"]

# # https://huggingface.co/spaces/Stevross/n8n/blob/main/Dockerfile
# # Base image with Node.js
# FROM node:18-alpine
# USER root

# # Arguments that can be passed at build time
# ARG N8N_PATH=/usr/local/lib/node_modules/n8n
# ARG BASE_PATH=/root/.n8n
# ARG DATABASE_PATH=$BASE_PATH
# ARG LOG_PATH=$BASE_PATH/logs
# ARG STORAGE_PATH=$BASE_PATH/storage

# # Install dependencies
# RUN apk add --no-cache git python3 py3-pip make g++ build-base cairo-dev pango-dev

# # Install n8n globally
# RUN npm install -g n8n

# # Create directories and set permissions
# RUN mkdir -p $LOG_PATH $N8N_PATH/uploads && chmod -R 777 $LOG_PATH $N8N_PATH

# # Set work directory
# WORKDIR /data

# # Configure environment variables (can be set in your docker-compose or runtime)
# ENV DB_TYPE=postgresdb
# ENV DB_POSTGRESDB_HOST=postgres
# ENV DB_POSTGRESDB_USER=${POSTGRES_USER}
# ENV DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
# ENV N8N_DIAGNOSTICS_ENABLED=false
# ENV N8N_PERSONALIZATION_ENABLED=false
# ENV N8N_HOST=n8n.web4ai.cloud
# ENV N8N_PROTOCOL=https
# ENV N8N_SECURE_COOKIE=true
# ENV N8N_PORT=5678
# ENV N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
# ENV N8N_USER_MANAGEMENT_JWT_SECRET=${N8N_USER_MANAGEMENT_JWT_SECRET}

# # Expose the default n8n port
# EXPOSE 5678

# # Start n8n
# CMD ["n8n"]


# # FROM node:12.13.0-alpine

# # ARG N8N_VERSION

# # RUN if [ -z "$N8N_VERSION" ] ; then echo "The N8N_VERSION argument is missing!" ; exit 1; fi

# # # Update everything and install needed dependencies
# # RUN apk add --update graphicsmagick tzdata

# # # # Set a custom user to not have n8n run as root
# # USER root

# # # Install n8n and the also temporary all the packages
# # # it needs to build it correctly.
# # RUN apk --update add --virtual build-dependencies python build-base ca-certificates && \
# # 	npm_config_user=root npm install -g n8n@${N8N_VERSION} && \
# # 	apk del build-dependencies

# # WORKDIR /data

# # CMD ["n8n"]


# # # # Use the official n8n image as the base
# # # FROM n8nio/n8n:latest

# # # # Set the working directory
# # # WORKDIR /home/node

# # # # Expose the default n8n port
# # # EXPOSE 5678

# # # # Set environment variables for timezone (optional, adjust as needed)
# # # ENV GENERIC_TIMEZONE=UTC
# # # ENV TZ=UTC

# # # ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
# # # # Create a volume for persisting n8n data
# # # VOLUME /home/node/.n8n

# # # # Command to run n8n
# # # CMD ["n8n", "start"]

# # # # # Use the official n8n image as base
# # # # FROM n8nio/n8n:latest

# # # # # Set environment variables
# # # # ENV N8N_BASIC_AUTH_ACTIVE=true
# # # # ENV N8N_BASIC_AUTH_USER=<your_username>
# # # # ENV N8N_BASIC_AUTH_PASSWORD=<your_secure_password>
# # # # ENV N8N_HOST=<your_domain_or_ip>
# # # # ENV N8N_PORT=5678
# # # # ENV N8N_PROTOCOL=http
# # # # ENV NODE_ENV=production

# # # # # Expose the default n8n port
# # # # EXPOSE 5678

# # # # # Set the working directory
# # # # WORKDIR /data

# # # # # Persist data to volume
# # # # VOLUME ["/data"]

# # # # # Start n8n
# # # # CMD ["n8n"]