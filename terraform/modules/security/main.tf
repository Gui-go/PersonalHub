resource "google_secret_manager_secret" "gh_token_secret" {
  project   = var.proj_id
  secret_id = "gh-access-token-secret"
  labels = {
    label = "gh-token123"
  }
  replication {
    user_managed {
      replicas {
        location = var.location
      }
    }
  }
}

resource "google_project_iam_member" "dataform_bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "dataform_secret_access" {
  project = var.proj_id
  secret_id = google_secret_manager_secret.gh_token_secret.id
  role      = "roles/secretmanager.secretAccessor" 
  member    = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}






