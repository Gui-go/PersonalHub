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
#   project      = var.proj_id
#   account_id   = "gh-actions"
#   display_name = "GitHub Actions Cloud Run Deployer"
# }

# # Assign roles/run.admin role to the service account
# resource "google_project_iam_member" "run_admin" {
#   project = var.proj_id
#   role    = "roles/run.admin"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# # Assign roles/iam.serviceAccountUser role to the service account
# resource "google_project_iam_member" "iam_service_account_user" {
#   project = var.proj_id
#   role    = "roles/iam.serviceAccountUser"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# # Assign roles/artifactregistry.admin role to the service account
# resource "google_project_iam_member" "artifact_registry_admin" {
#   project = var.proj_id
#   role    = "roles/artifactregistry.admin"
#   member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
# }

# Create a service account key
# resource "google_service_account_key" "github_actions_deployer_key" {
#   service_account_id = google_service_account.github_actions_deployer.name
# }



# resource "google_iam_workload_identity_pool" "github_pool" {
#   provider                  = google
#   project                   = var.proj_id
#   workload_identity_pool_id = "github-pool"
#   display_name              = "GitHub Pool"
# }

# resource "google_iam_workload_identity_pool_provider" "github_provider" {
#   provider                           = google
#   workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
#   workload_identity_pool_provider_id = "github-provider"
#   display_name                       = "GitHub Provider"
#   oidc {
#     issuer_uri = "https://token.actions.githubusercontent.com"
#   }
#   attribute_mapping = {
#     "google.subject"       = "assertion.sub"
#     "attribute.repository" = "assertion.repository"
#   }
# }

# resource "google_service_account_iam_member" "workload_identity_binding" {
#   service_account_id = data.google_service_account.github_actions_deployer.name
#   role               = "roles/iam.workloadIdentityUser"
#   member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/Gui-go/PersonalHub"
# }