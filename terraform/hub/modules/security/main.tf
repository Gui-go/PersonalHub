
# GitHub account settings > Developer settings > Personal access tokens > Tokens (classic)
resource "google_secret_manager_secret" "gh_token_secret" {
  project   = var.proj_id
  secret_id = "gh-access-token-secret"
  labels = {
    label = "gh-token123"
    owner = var.tag_owner
    env   = var.tag_env
  }
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

# data "google_secret_manager_secret_version" "gh_token_secret_version" {
#   project = var.proj_id
#   secret  = google_secret_manager_secret.gh_token_secret.secret_id
#   depends_on = [ google_secret_manager_secret.gh_token_secret ]
# }


resource "google_secret_manager_secret" "main_secret" {
  project   = var.proj_id
  secret_id = "main-secret"
  labels = {
    owner = var.tag_owner
    env   = var.tag_env
  }
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

# data "google_secret_manager_secret_version" "main_secret_version" {
#   project = var.proj_id
#   secret  = google_secret_manager_secret.main_secret.secret_id
#   depends_on = [ google_secret_manager_secret.main_secret ]
# }


# resource "google_secret_manager_secret_version" "postgres_password_version" {
#   secret = google_secret_manager_secret.main_secret.id
#   secret_data = "YourSecurePasswordHere" # Replace with secure password
# }

# data "google_secret_manager_secret_version" "main_secret_version" {
#   project = var.proj_id
#   secret  = google_secret_manager_secret.main_secret.secret_id
#   depends_on = [ google_secret_manager_secret.main_secret ]
#   # If you manage versions manually in the UI, this fetches the latest enabled version
# }

# resource "google_secret_manager_secret_version" "gh_token_secret_version" {
# #   provider    = google-beta
#   secret_id   = google_secret_manager_secret.gh_token_secret.id
#   secret_data = var.github_token # Use a variable to avoid hardcoding
# }


# resource "google_secret_manager_secret_version" "gh_token_secret_version" {
#   secret_id   = google_secret_manager_secret.gh_token_secret.id
#   secret_data = "var.my_secret"
# }



# resource "google_secret_manager_secret" "gh_token_secret" {
#   project   = var.proj_id
#   secret_id = "gh-access-token-secret"
#   labels = {
#     label = "gh-token123"
#   }
#   replication {
#     user_managed {
#       replicas {
#         location = var.region
#       }
#     }
#   }
# }

# resource "google_project_iam_member" "dataform_bigquery_job_user" {
#   project = var.proj_id
#   role    = "roles/bigquery.jobUser"
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# resource "google_secret_manager_secret_iam_member" "dataform_secret_access" {
#   project = var.proj_id
#   secret_id = google_secret_manager_secret.gh_token_secret.id
#   role      = "roles/secretmanager.secretAccessor" 
#   member    = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }






# # Create the service account for GH Actions:
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

# # Create a service account key
# resource "google_service_account_key" "github_actions_deployer_key" {
#   service_account_id = google_service_account.github_actions_deployer.name
# }

















# resource "google_service_account" "fastapi_sa" {
#   project      = var.proj_id
#   account_id   = "fastapi-sa"
#   display_name = "FastAPI API SA"
# }

# resource "google_project_iam_member" "fastapi_sa_bqdataviewer" {
#   project    = var.proj_id
#   role       = "roles/bigquery.dataViewer"
#   member     = "serviceAccount:${google_service_account.fastapi_sa.email}"
#   depends_on = [ google_service_account.fastapi_sa ]
# }

# resource "google_project_iam_member" "fastapi_sa_bqjobuser" {
#   project    = var.proj_id
#   role       = "roles/bigquery.jobUser"
#   member     = "serviceAccount:${google_service_account.fastapi_sa.email}"
#   depends_on = [ google_service_account.fastapi_sa ]
# }

# resource "google_service_account_key" "fastapi_sa_key" {
#   service_account_id = google_service_account.fastapi_sa.name
#   depends_on         = [ google_service_account.fastapi_sa ]
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