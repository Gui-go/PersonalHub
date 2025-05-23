

# Portfolio ------------------------------------------------------------------------------------------

resource "google_cloud_run_service_iam_member" "portfolio_public_access" {
  project  = var.proj_id
  service  = var.run_portfolio.service
  location = var.run_portfolio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}





# FastAPI API ------------------------------------------------------------------------------------------

resource "google_service_account" "fastapi_sa" {
  project      = var.proj_id
  account_id   = "fastapi-sa"
  display_name = "fastapi-sa"
}

resource "google_project_iam_member" "bigquery_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "bigquery_admin" {
  project = var.proj_id
  role    = "roles/bigquery.admin"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "storage_object_viewer" {
  project = var.proj_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

# Allow unauthenticated access (optional, remove if authentication is required)
resource "google_cloud_run_service_iam_member" "public_access" {
  project  = var.proj_id
  location = var.location
  service  = var.run_fastapi.service
  role     = "roles/run.invoker"
  member   = "allUsers"
}



# BQ Dataform ------------------------------------------------------------------------------------------

resource "google_service_account" "customdataform_sa" {
  project      = var.proj_id
  account_id   = "dataform-sa"
  display_name = "Dataform SA"
}

resource "google_project_iam_member" "customdataform_sa_bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_secret_manager_secret_accessor" {
  project = var.proj_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_bq_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}





# BQ DataForm GCP managed SA ------------------------------------------------------------------------------------------

# DataFrom demands this role to be created for the GCP managed service account
resource "google_project_iam_member" "gcpdataform_sa_token_creator" {
  project = var.proj_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "gcpdataform_sa_secret_manager" {
  project = var.proj_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}


resource "google_project_iam_member" "gcpdataform_sa_bq_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "gcpdataform_sa_bq_data_editor" {
  project = var.proj_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}


