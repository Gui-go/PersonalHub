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






# # Create the service account
# resource "google_service_account" "github_actions_deployer" {
#   account_id   = "github-actions-deployer"
#   display_name = "GitHub Actions Cloud Run Deployer"
#   project      = "personalhub3"
# }

# # Assign roles/run.admin role to the service account
# resource "google_project_iam_member" "run_admin" {
#   project = "personalhub3"
#   role    = "roles/run.admin"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# # Assign roles/iam.serviceAccountUser role to the service account
# resource "google_project_iam_member" "iam_service_account_user" {
#   project = "personalhub3"
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# # Assign roles/artifactregistry.admin role to the service account
# resource "google_project_iam_member" "artifact_registry_admin" {
#   project = "personalhub3"
#   role    = "roles/artifactregistry.admin"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# # Create a service account key
# resource "google_service_account_key" "github_actions_deployer_key" {
#   service_account_id = google_service_account.github_actions_deployer.name
# }

