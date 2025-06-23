# FROM debian:bullseye-slim

# RUN apt-get update && apt-get install -y gnupg curl apt-transport-https software-properties-common && \
#     echo "deb https://packages.grafana.com/oss/deb stable main" > /etc/apt/sources.list.d/grafana.list && \
#     curl https://packages.grafana.com/gpg.key | apt-key add - && \
#     apt-get update && apt-get install -y grafana

# RUN echo "deb http://packages.cloud.google.com/apt gcsfuse-$(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/gcsfuse.list && \
#     curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
#     apt-get update && apt-get install -y gcsfuse && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN mkdir -p /var/lib/grafana

# ARG VOLUME_BUCKET
# ENV VOLUME_BUCKET=$VOLUME_BUCKET

# CMD gcsfuse --implicit-dirs ${VOLUME_BUCKET} /var/lib/grafana && /usr/sbin/grafana-server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini

# EXPOSE 3000

# FROM debian:bullseye-slim

# RUN apt-get update && apt-get install -y gnupg curl apt-transport-https lsb-release \
#     software-properties-common wget unzip && \
#     echo "deb https://packages.grafana.com/oss/deb stable main" > /etc/apt/sources.list.d/grafana.list && \
#     curl https://packages.grafana.com/gpg.key | apt-key add - && \
#     apt-get update && apt-get install -y grafana google-cloud-cli && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN mkdir -p /var/lib/grafana

# ENV GF_SERVER_HTTP_PORT=$PORT
# ARG GCP_PROJECT
# ENV GCP_PROJECT=$GCP_PROJECT

# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# CMD ["/entrypoint.sh"]

# EXPOSE 3000


FROM debian:bullseye-slim

# Install required tools and Grafana
RUN apt-get update && apt-get install -y gnupg curl apt-transport-https software-properties-common && \
    echo "deb https://packages.grafana.com/oss/deb stable main" > /etc/apt/sources.list.d/grafana.list && \
    curl https://packages.grafana.com/gpg.key | apt-key add - && \
    apt-get update && apt-get install -y grafana && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install gcsfuse for GCS mounting
RUN echo "deb http://packages.cloud.google.com/apt gcsfuse-bullseye main" | tee /etc/apt/sources.list.d/gcsfuse.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    apt-get update && apt-get install -y gcsfuse && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create Grafana data directory
RUN mkdir -p /var/lib/grafana && chown -R grafana:grafana /var/lib/grafana

# Use consistent environment variable name
ARG GCP_PROJECT
ENV GCP_PROJECT=$GCP_PROJECT

# Run gcsfuse and Grafana server
# Note: Cloud Run requires a single process, so we use exec to run Grafana directly
# gcsfuse is run in the background to mount GCS before starting Grafana
CMD /bin/bash -c "gcsfuse --implicit-dirs gs://${VOLUME_BUCKET}-grafana-bucket/ /var/lib/grafana & exec /usr/sbin/grafana-server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini"

EXPOSE 3000


# Optional: install Grafana plugins (example)
# ENV GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel
# ENV GF_SECURITY_ADMIN_USER=admin
# ENV GF_SECURITY_ADMIN_PASSWORD=admin
# ENV GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel

# Optional: copy custom dashboards or config (uncomment as needed)
# COPY ./provisioning /etc/grafana/provisioning
# COPY ./dashboards /var/lib/grafana/dashboards

# Optional: set custom config files
# COPY grafana.ini /etc/grafana/grafana.ini
