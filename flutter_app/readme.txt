


docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub3/personalhub-artifact-repo/fluuter-portfolio:latest  \
  -f fluuter-portfolio.dockerfile \
  --push .




  