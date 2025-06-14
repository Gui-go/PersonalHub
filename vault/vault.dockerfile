# Use the official Vaultwarden image as the base
FROM vaultwarden/server:latest

# Install dependencies (curl, fuse) and clean up to reduce image size
RUN apt-get update && \
    apt-get install -y curl fuse && \
    rm -rf /var/lib/apt/lists/*

# Download and install gcsfuse
# RUN curl -L https://github.com/GoogleCloudPlatform/gcsfuse/releases/download/v0.41.0/gcsfuse_0.41.0_amd64.deb -o gcsfuse.deb && \
#     dpkg -i gcsfuse.deb && \
#     rm gcsfuse.deb