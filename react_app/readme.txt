




gcloud auth configure-docker us-central1-docker.pkg.dev






docker buildx build --platform linux/amd64,linux/arm64 \
  -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$TAG \
  --push .


docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub3/personalhub-artifact-repo/portfolio-app:latest  \
  --push .