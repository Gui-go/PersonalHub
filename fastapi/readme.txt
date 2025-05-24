


docker buildx build --platform linux/amd64 \
  -t guigo13/fastapi-api:latest \
  -f fastapi/fastapi.dockerfile \
  --push fastapi/


gcloud iam service-accounts keys create ~/Documents/06-personalHub/fastapi/fastapi-sa-key.json \
  --iam-account=fastapi-sa@personalhub11.iam.gserviceaccount.com \
  --project=personalhub11


# to be able to run the functions locally:
gcloud auth activate-service-account fastapi-sa@personalhub3.iam.gserviceaccount.com \
  --key-file=~/Documents/06-personalHub/fastapi/service-account-key.json
