FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y gnupg curl apt-transport-https software-properties-common && \
    echo "deb https://packages.grafana.com/oss/deb stable main" > /etc/apt/sources.list.d/grafana.list && \
    curl https://packages.grafana.com/gpg.key | apt-key add - && \
    apt-get update && apt-get install -y grafana

RUN echo "deb http://packages.cloud.google.com/apt gcsfuse-$(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/gcsfuse.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    apt-get update && apt-get install -y gcsfuse && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/lib/grafana

ARG VOLUME_BUCKET
ENV VOLUME_BUCKET=$VOLUME_BUCKET

CMD gcsfuse --implicit-dirs ${VOLUME_BUCKET} /var/lib/grafana && /usr/sbin/grafana-server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini

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
