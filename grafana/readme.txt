




docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/grafana-app:latest \
  -f grafana.dockerfile \
  --push .





            gcloud run deploy grafana-run \
            --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/grafana-app:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated

