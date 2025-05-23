


docker buildx build --platform linux/amd64 \
  -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/personalhub-artifact-repo/fastapi-api:latest \
  -f fastapi/fastapi.dockerfile \
  --push fastapi/

docker buildx build --platform linux/amd64 \
  -t guigo13/fastapi-api:latest \
  -f fastapi/fastapi.dockerfile \
  --push fastapi/


gcloud iam service-accounts keys create ~/Documents/06-personalHub/fastapi/fastapi-sa-key.json \
  --iam-account=fastapi-sa@personalhub3.iam.gserviceaccount.com \
  --project=personalhub3


# to be able to run the functions locally:
gcloud auth activate-service-account fastapi-sa@personalhub3.iam.gserviceaccount.com \
  --key-file=~/Documents/06-personalHub/fastapi/service-account-key.json
