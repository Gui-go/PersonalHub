# Use the official Grafana image as a base
FROM grafana/grafana-oss:10.4.2

# Install gcsfuse
RUN apt-get update && apt-get install -y \
    gnupg curl lsb-release && \
    echo "deb http://packages.cloud.google.com/apt gcsfuse-$(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/gcsfuse.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    apt-get update && apt-get install -y gcsfuse && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create mount directory
RUN mkdir -p /var/lib/grafana

# Mount GCS bucket and start Grafana in CMD
CMD gcsfuse --implicit-dirs ${GCS_BUCKET} /var/lib/grafana && /run.sh


ENV GF_SERVER_HTTP_PORT=3000


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
