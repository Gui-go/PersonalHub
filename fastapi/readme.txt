












docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub3/personalhub-artifact-repo/fastapi-api:latest  \
  -f fastapi.dockerfile \
  --push .




gcloud iam service-accounts keys create ~/Documents/06-personalHub/fastapi/fastapi-sa-key.json \
  --iam-account=fastapi-sa@personalhub3.iam.gserviceaccount.com \
  --project=personalhub3


# to be able to run the functions locally:
gcloud auth activate-service-account fastapi-sa@personalhub3.iam.gserviceaccount.com \
  --key-file=~/Documents/06-personalHub/fastapi/service-account-key.json
