

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




