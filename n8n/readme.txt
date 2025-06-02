
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