




docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/fastapi-api:latest \
  -f fastapi.dockerfile \
  --push .

gcloud run deploy fastapi-run \
  --image=us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/fastapi-app:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --concurrency=1 \
  --cpu=1 \
  --memory=512Mi

