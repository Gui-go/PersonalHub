


docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub3/personalhub-artifact-repo/rstudio-app:latest  \
  -f rstudio.dockerfile \
  --push .




  