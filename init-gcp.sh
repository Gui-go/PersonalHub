#!/bin/bash

# chmod +x gcp-init.sh

# gcloud resetting:
gcloud config unset compute/region
gcloud config unset project
gcloud config unset billing/quota_project
gcloud auth application-default revoke --quiet

# gcloud auth:
# These credentials will be used by any library that requests Application Default Credentials (ADC).
gcloud auth login --quiet
gcloud auth application-default login --quiet

# Variables:
# set -o allexport; source .env; set +o allexport
echo $PROJ_ID

# Other related projects:
# gcloud projects create "gcs-personalhub1" --name="gcs-personalhub" --labels=owner=guilhermeviegas --enable-cloud-apis --quiet
# gcloud beta billing projects link "gcs-personalhub1" --billing-account=$BILLING_ACC
# gcloud config set project "gcs-personalhub1"
# gcloud config set billing/quota_project "gcs-personalhub1"

# gcloud auth application-default set-quota-project personalhub13
# gcloud config set billing/quota_project personalhub13



# GCP setting:
gcloud projects create $PROJ_ID --name=$PROJ_NAME --labels=owner=guilhermeviegas --enable-cloud-apis --quiet
gcloud beta billing projects link $PROJ_ID --billing-account=$BILLING_ACC
gcloud config set project $PROJ_ID
gcloud config set billing/quota_project $PROJ_ID
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJ_ID
gcloud auth application-default set-quota-project $PROJ_ID --quiet
cd ~/Documents/01-personalHub
gcloud config list

# APIs enabling:
gcloud services enable vpcaccess.googleapis.com --project=$PROJ_ID
gcloud services enable compute.googleapis.com --project=$PROJ_ID
gcloud services enable dns.googleapis.com --project=$PROJ_ID
gcloud services enable iam.googleapis.com --project=$PROJ_ID
gcloud services enable discoveryengine.googleapis.com --project=$PROJ_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJ_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJ_ID
gcloud services enable run.googleapis.com --project=$PROJ_ID
gcloud services enable container.googleapis.com --project=$PROJ_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJ_ID
gcloud services enable cloudfunctions.googleapis.com --project=$PROJ_ID
gcloud services enable logging.googleapis.com --project=$PROJ_ID
gcloud services enable monitoring.googleapis.com --project=$PROJ_ID
gcloud services enable storage.googleapis.com --project=$PROJ_ID
gcloud services enable pubsub.googleapis.com --project=$PROJ_ID
gcloud services enable cloudtasks.googleapis.com --project=$PROJ_ID
gcloud services enable cloudscheduler.googleapis.com --project=$PROJ_ID
gcloud services enable bigquery.googleapis.com --project=$PROJ_ID
gcloud services enable bigquerydatatransfer.googleapis.com --project=$PROJ_ID
gcloud services enable bigquerydatatransfer.googleapis.com --project=$PROJ_ID
gcloud services enable servicenetworking.googleapis.com --project=$PROJ_ID
gcloud services enable firestore.googleapis.com --project=$PROJ_ID
gcloud services enable firebaserules.googleapis.com --project=$PROJ_ID

# analyticsadmin.googleapis.com

# gcloud services enable bigqueryconnection.googleapis.com aiplatform.googleapis.com
# gcloud services enable aiplatform.googleapis.com bigqueryconnection.googleapis.com

# Create SA and grant roles to it.
# export GH_ACTIONS_SA="ghactionsSA"
# gcloud iam service-accounts create $GH_ACTIONS_SA \
#     --description="Service account for project ${PROJECT_NAME}, named $GH_ACTIONS_SA, to build and deploy through GCP in my behalf." \
#     --display-name=$GH_ACTIONS_SA
# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/run.admin"
# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/iam.serviceAccountUser"
# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/artifactregistry.admin"

# Create key JSON file and add it to GH Actions: 
# gcloud iam service-accounts keys create ${GH_ACTIONS_SA}-key.json \
#   --iam-account=$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com

##


# gcloud auth configure-docker europe-north2-docker.pkg.dev --quiet

# docker buildx build --platform linux/amd64 \
#   -t europe-north2-docker.pkg.dev/personalhub11/personalhub-artifact-repo/portfolio-app:latest  \
#   -f react.dockerfile \
#   --push .




# terraform init 
# terraform plan -out=plan.out
# terraform apply
# terraform state list
# # terraform output
# terraform graph | dot -Tsvg > terraform-graph.svg


# Create TXT record for domain verification:
## Browse "Google Search Console"
## Copy "TXT Record"
## Paste to registro.br domain registry.



# gcloud projects delete $PROJ_ID
