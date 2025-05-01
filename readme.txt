










# Flutter app:
flutter config --enable-web
flutter create flutter_app
cd flutter_app
flutter run -d web
flutter run -d chrome
flutter build web

# Build:
docker build -t guigo13/personalhub .

# Run:
docker run -p 8080:80 guigo13/personalhub

docker push guigo13/personalhub


gcloud auth configure-docker
docker tag flutter-app gcr.io/YOUR_PROJECT_ID/flutter-app
docker push gcr.io/YOUR_PROJECT_ID/flutter-app
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME



gcloud run deploy flutter-app --image gcr.io/YOUR_PROJECT_ID/flutter-app --platform managed --allow-unauthenticated --region us-central1


gcloud services enable run.googleapis.com

gcloud iam service-accounts create github-actions-deployer \
  --display-name "GitHub Actions Cloud Run Deployer"


gcloud projects add-iam-policy-binding personalhub1 \
  --member="serviceAccount:github-actions-deployer@personalhub1.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding personalhub1 \
  --member="serviceAccount:github-actions-deployer@personalhub1.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding personalhub1 \
  --member="serviceAccount:github-actions-deployer@personalhub1.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-deployer@personalhub1.iam.gserviceaccount.com


gcloud artifacts repositories create personalhub-repo \
  --repository-format=docker \
  --location=us \
  --description="Docker repo for my portfolio app"




--
# To get Discovery Engine access to GCS bucket: 
gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.admin

gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.objectAdmin

gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.objectCreator

--

gcloud iam service-accounts create terraform-local-sa \
  --display-name "Allows Terraform to create GCP resources"




terraform init 
terraform apply
terraform state list

terraform state show module.network.google_dns_record_set.tf_a_record

# Get a graph viz:
terraform graph | dot -Tsvg > graph.svg




Google Search Console
TXT Record 
domain from registro.br





add network


# docker build -t d3-map-app .
# docker run -p 3000:3000 d3-map-app
docker compose up --build


docker build -t vanilla_app .
docker run -p 3000:3000 vanilla_app



docker build -t guigo13/personalhub-flutter .
docker build -t guigo13/personalhub-flutter -f flutter_app/Dockerfile .
docker build -t guigo13/personalhub-flutter -f flutter_app/Dockerfile flutter_app

docker run -p 8080:8080 guigo13/personalhub-flutter
