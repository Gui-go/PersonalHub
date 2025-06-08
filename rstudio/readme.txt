


docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/rstudio-app:latest  \
  -f rstudio/rstudio.dockerfile \
  --push rstudio/




  