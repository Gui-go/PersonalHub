#!/bin/bash

# chmod +x gcp-init.sh

# Variables:
export BILLING_ACC="01F0C7-9A2082-488963"
export PROJECT_NAME="personalhub"
export PROJECT_ID="${PROJECT_NAME}3"
export REGION="us-central1"

# GCP setting:
gcloud projects create $PROJECT_ID --name=$PROJECT_NAME --labels=owner=guilhermeviegas --enable-cloud-apis
gcloud beta billing projects link $PROJECT_ID --billing-account=$BILLING_ACC
gcloud config set project $PROJECT_ID
gcloud config set billing/quota_project $PROJECT_ID
gcloud auth application-default set-quota-project $PROJECT_ID
cd ~/Documents/06-personalHub
gcloud config list

# APIs enabling:
gcloud services enable compute.googleapis.com --project=$PROJECT_ID
gcloud services enable dns.googleapis.com --project=$PROJECT_ID
gcloud services enable iam.googleapis.com --project=$PROJECT_ID
gcloud services enable discoveryengine.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable container.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudfunctions.googleapis.com --project=$PROJECT_ID
gcloud services enable logging.googleapis.com --project=$PROJECT_ID
gcloud services enable monitoring.googleapis.com --project=$PROJECT_ID
gcloud services enable storage.googleapis.com --project=$PROJECT_ID
gcloud services enable pubsub.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudtasks.googleapis.com --project=$PROJECT_ID

# gcloud services enable cloudscheduler.googleapis.com --project=$PROJECT_ID
# gcloud services enable bigquery.googleapis.com --project=$PROJECT_ID
# gcloud services enable bigquerydatatransfer.googleapis.com --project=$PROJECT_ID

# Create SA and grant roles to it.
export GH_ACTIONS_SA="ghactionsSA"
gcloud iam service-accounts create $GH_ACTIONS_SA \
    --description="Service account for project ${PROJECT_NAME}, named $GH_ACTIONS_SA, to build and deploy through GCP in my behalf." \
    --display-name=$GH_ACTIONS_SA
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GH_ACTIONS_SA@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GH_ACTIONS_SA@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GH_ACTIONS_SA@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

# Create key JSON file and add it to GH Actions: 
gcloud iam service-accounts keys create ${GH_ACTIONS_SA}-key.json \
  --iam-account=$GH_ACTIONS_SA@$PROJECT_ID.iam.gserviceaccount.com

##


terraform init 
terraform plan -out=plan.out
terraform apply
terraform state list
# terraform output
terraform graph | dot -Tsvg > terraform-graph.svg


# Create TXT record for domain verification:
## Browse "Google Search Console"
## Copy "TXT Record"
## Paste to registro.br domain registry.



docker buildx build --platform linux/amd64 \
  -t $REGION-docker.pkg.dev/$PROJECT_ID/${PROJECT_NAME}-artifact-repo/frontend-app:latest \
  --push react_app/

