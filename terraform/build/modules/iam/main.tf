


# Create a service account for Terraform 
resource "google_service_account" "terraform_sa" {
  project      = var.proj_id
  account_id   = "terraform-sa"
  display_name = "Terraform Service Account"
  description  = "Service Account for Deployment via Terraform"
}

resource "google_project_iam_member" "terraform_sa_role" {
  project = var.proj_id
  role    = "roles/owner"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

# Download Json ley manually from GCP console

# # Portfolio ------------------------------------------------------------------------------------------

resource "google_service_account" "portfolio_run_sa" {
  project      = var.proj_id
  account_id   = "portfolio-sa"
  display_name = "Portfolio Service Account"
  description  = "Service Account for Portfolio Cloud Run Service"
}

# resource "google_cloud_run_service_iam_member" "portfolio_invoker_iam_member" {
#   project  = var.proj_id
#   service  = var.run_portfolio.service
#   location = var.run_portfolio.region
#   role     = "roles/run.invoker"
#   member   = "allUsers"
#   # member = "serviceAccount:${google_service_account.portfolio_sa.email}"
# }

# # FastAPI API ------------------------------------------------------------------------------------------

resource "google_service_account" "fastapi_run_sa" {
  project      = var.proj_id
  account_id   = "fastapi-sa"
  display_name = "FastAPI Service Account"
  description  = "Service Account for FastAPI Cloud Run Service"
}

# resource "google_project_iam_member" "bigquery_data_viewer" {
#   project = var.proj_id
#   role    = "roles/bigquery.dataViewer"
#   member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
# }

# resource "google_project_iam_member" "bigquery_job_user" {
#   project = var.proj_id
#   role    = "roles/bigquery.jobUser"
#   member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
# }

# resource "google_project_iam_member" "bigquery_admin" {
#   project = var.proj_id
#   role    = "roles/bigquery.admin"
#   member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
# }

# resource "google_project_iam_member" "storage_object_viewer" {
#   project = var.proj_id
#   role    = "roles/storage.objectViewer"
#   member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
# }

# # Allow unauthenticated access (optional, remove if authentication is required)
# resource "google_cloud_run_service_iam_member" "public_access" {
#   project  = var.proj_id
#   service  = var.run_fastapi.service
#   location = var.region
#   role     = "roles/run.invoker"
#   # member   = "allUsers"
#   member = "serviceAccount:${google_service_account.portfolio_sa.email}"
#   # member = "serviceAccount:frontend-invoker@your-project-id.iam.gserviceaccount.com"
# }



# # BQ Dataform ------------------------------------------------------------------------------------------

# resource "google_service_account" "customdataform_sa" {
#   project      = var.proj_id
#   account_id   = "dataform-sa"
#   display_name = "Dataform SA"
# }

# resource "google_project_iam_member" "customdataform_sa_bigquery_job_user" {
#   project = var.proj_id
#   role    = "roles/bigquery.jobUser"
#   member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }

# resource "google_project_iam_member" "customdataform_sa_secret_manager_secret_accessor" {
#   project = var.proj_id
#   role    = "roles/iam.serviceAccountTokenCreator"
#   member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }

# resource "google_project_iam_member" "customdataform_sa_bq_data_viewer" {
#   project = var.proj_id
#   role    = "roles/bigquery.dataViewer"
#   member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }

# resource "google_project_iam_member" "customdataform_sa_bq_table_create" {
#   project = var.proj_id
#   role    = "roles/bigquery.dataEditor"
#   member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }

# resource "google_project_iam_member" "customdataform_sa_bq_object_viewer" {
#   project = var.proj_id
#   role    = "roles/storage.objectViewer"
#   member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }





# # BQ DataForm GCP managed SA ------------------------------------------------------------------------------------------

# # DataFrom demands this role to be created for the GCP managed service account
# resource "google_project_iam_member" "gcpdataform_sa_token_creator" {
#   project = var.proj_id
#   role    = "roles/iam.serviceAccountTokenCreator"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# resource "google_project_iam_member" "gcpdataform_sa_secret_manager" {
#   project = var.proj_id
#   role    = "roles/secretmanager.secretAccessor"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }


# resource "google_project_iam_member" "gcpdataform_sa_bq_data_viewer" {
#   project = var.proj_id
#   role    = "roles/bigquery.dataViewer"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# resource "google_project_iam_member" "gcpdataform_sa_bq_data_editor" {
#   project = var.proj_id
#   role    = "roles/bigquery.dataEditor"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# resource "google_project_iam_member" "gcpdataform_sa_bq_job_user" {
#   project = var.proj_id
#   role    = "roles/bigquery.jobUser"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# # BQ Gemini Connection -------------------------------------------------------------------------

# resource "google_bigquery_connection" "bq_gemini_connection" {
#   connection_id = "bq_gemini_connection"
#   project       = var.proj_id
#   location      = var.location
#   cloud_resource {}
# }

# resource "google_project_iam_member" "vertex_ai_user" {
#   project = var.proj_id
#   role    = "roles/aiplatform.user"
#   member  = "serviceAccount:${google_bigquery_connection.bq_gemini_connection.cloud_resource[0].service_account_id}"
# }

# resource "google_bigquery_connection_iam_member" "dataform_can_use_connection" {
#   project       = var.proj_id
#   location      = var.location
#   connection_id = google_bigquery_connection.bq_gemini_connection.connection_id
#   role          = "roles/bigquery.connectionUser"
#   member        = "serviceAccount:${google_service_account.customdataform_sa.email}"
# }


# # GH Actions SA -------------------------------------------------------------------------

# # Create a service account
# resource "google_service_account" "githubactions_sa" {
#   project      = var.proj_id
#   account_id   = "github-actions-sa"
#   display_name = "GitHub Actions Service Account"
#   description  = "Service Account for Deployment via GitHub Actions"
# }

# # Assign roles for Cloud Run (to deploy and manage services)
# resource "google_project_iam_member" "run_admin_iam_member" {
#   project = var.proj_id
#   role    = "roles/run.admin"
#   member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
# }

# # Grant the service account permission to act as a Cloud Run runtime service account
# resource "google_project_iam_member" "service_account_user_iam_member" {
#   project = var.proj_id
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
# }

# resource "google_project_iam_member" "artifact_registry_writer_iam_member" {
#   project = var.proj_id
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
# }

# resource "google_project_iam_member" "storage_admin_iam_member" {
#   project = var.proj_id
#   role    = "roles/storage.admin"
#   member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
# }

# resource "google_project_iam_member" "security_admin_iam_member" {
#   project = var.proj_id
#   role    = "roles/iam.securityAdmin"
#   member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
# }



