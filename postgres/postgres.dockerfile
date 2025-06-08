# Use the official PostgreSQL image
FROM postgres:15-alpine

# Environment variables for PostgreSQL configuration
ENV POSTGRES_DB=db1
ENV POSTGRES_USER=guigo
ENV POSTGRES_PASSWORD=passwd

# Expose PostgreSQL default port
EXPOSE 5432

# Health check to ensure the database is ready
# HEALTHCHECK --interval=5s --timeout=3s --start-period=5s \
#   CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Copy any initialization scripts (optional)
# COPY init.sql /docker-entrypoint-initdb.d/


# psql -h localhost -p 5432 -U guigo -d db1



