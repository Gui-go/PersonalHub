FROM n8nio/n8n:latest

# Basic environment config
ENV NODE_ENV=production
ENV N8N_PORT=8080
ENV GENERIC_TIMEZONE=UTC
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=passwd

# Webhook URL = your Cloud Run public HTTPS URL
ENV WEBHOOK_URL=https://n8n-run-241432738087.us-central1.run.app/

# DB config (PostgreSQL example)
# ENV DB_TYPE=postgresdb
# ENV DB_POSTGRESDB_HOST=127.0.0.1
# ENV DB_POSTGRESDB_PORT=5432
# ENV DB_POSTGRESDB_DATABASE=n8n
# ENV DB_POSTGRESDB_USER=n8nuser
# ENV DB_POSTGRESDB_PASSWORD=securepassword
ENV DB_TYPE=postgresdb
ENV DB_POSTGRESDB_HOST=35.224.60.87
ENV DB_POSTGRESDB_PORT=5432
ENV DB_POSTGRESDB_DATABASE=postgres
ENV DB_POSTGRESDB_USER=postgres
ENV DB_POSTGRESDB_PASSWORD=postgres



# Disable diagnostics
ENV N8N_DIAGNOSTICS_ENABLED=false
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# Must match Cloud Run assigned port
EXPOSE 8080

# Entrypoint must explicitly respect $PORT
# CMD ["sh", "-c", "n8n start --port $PORT"]
