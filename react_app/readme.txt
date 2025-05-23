




gcloud auth configure-docker europe-north2-docker.pkg.dev --quiet


docker buildx build --platform linux/amd64 \
  -t europe-north2-docker.pkg.dev/personalhub11/personalhub-artifact-repo/portfolio-app:latest  \
  -f react.dockerfile \
  --push .

docker buildx build --platform linux/amd64 \
  -t guigo13/portfolio-app:latest  \
  -f react_app/react.dockerfile \
  --push react_app/