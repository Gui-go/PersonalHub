
docker build -t simple-n8n -f n8n.dockerfile .
docker build -t my-n8n-instance .


docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  simple-n8n

docker run -d \
  --name n8n \
  -p 5679:5678 \
  -v ~/.n8n:/data \
  my-n8n-instance



# to connect ollama in n8n:
# # http://ollama-p36:11434

docker exec -it n8n-ollama-p36-1 ollama list
docker exec -it n8n-ollama-p36-1 ollama pull llama3.2





docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/n8n-app:latest \
  -f n8n.dockerfile \
  --push .





            gcloud run deploy n8n-run \
            --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/n8n-app:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated \
            --port 5678


gcloud run deploy n8n-run \
  --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/n8n-app:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --concurrency=1 \
  --cpu=1 \
  --memory=512Mi



