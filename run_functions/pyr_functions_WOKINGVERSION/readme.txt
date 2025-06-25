



docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  -f Dockerfile \
  --push .

gcloud run deploy pyr-api \
  --image=us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated



