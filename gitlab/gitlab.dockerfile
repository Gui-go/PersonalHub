# Use the official GitLab Community Edition image as the base
FROM gitlab/gitlab-ce:latest

# Set the working directory
WORKDIR /home/git

# Expose ports for HTTP, HTTPS, and SSH
EXPOSE 80 443 22

# Set environment variables for GitLab configuration
ENV GITLAB_OMNIBUS_CONFIG="external_url 'http://gitlab.example.com'; gitlab_rails['gitlab_shell_ssh_port'] = 2222;"

# Ensure volumes for persistent data
VOLUME /etc/gitlab /var/log/gitlab /var/opt/gitlab

# Entrypoint is handled by the base image, which starts GitLab services