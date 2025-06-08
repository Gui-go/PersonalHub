






docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/postgres:latest \
  -f postgres/postgres.dockerfile \
  --push postgres/





            gcloud run deploy postgres-run \
            --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/postgres:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated


gcloud run deploy postgres-run \
  --image us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/postgres:latest \
  --platform managed \
  --allow-unauthenticated \
  --port 5432 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars POSTGRES_DB=db1,POSTGRES_USER=guigo,POSTGRES_PASSWORD=passwd,POSTGRES_HOST_AUTH_METHOD=trust


psql -h localhost -p 5432 -U guigo -d db1


psql -h postgres-run-241432738087.us-central1.run.app -U guigo -d db1





