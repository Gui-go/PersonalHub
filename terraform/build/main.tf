

provider "google" {
  project = var.proj_id
  region  = var.region
}

# provider "google" {
#   project     = var.proj_number
#   region      = var.location
#   credentials = file("personalhub14-teafform-service-account-key.json")
# }


provider "google-beta" {
  project     = var.proj_id
  region      = var.location
}

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "dns.googleapis.com",
    "servicenetworking.googleapis.com",
    "storage.googleapis.com",
    "cloudfunctions.googleapis.com",
    "eventarc.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iam.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "vpcaccess.googleapis.com",
    "eventarc.googleapis.com", # although not used, it is needed for google_cloudfunctions2_function
    "pubsub.googleapis.com",    # although not used, it is needed for google_cloudfunctions2_function
    "bigquery.googleapis.com",
    "discoveryengine.googleapis.com",
    "artifactregistry.googleapis.com",
    # "vertexai.googleapis.com"
  ])
  project = var.proj_id
  service = each.key
  disable_on_destroy = false
}

module "network" {
  source            = "./modules/network"
  proj_name         = var.proj_name
  proj_id           = var.proj_id
  region            = var.region
  tag_owner         = var.tag_owner
  vpc_subnet_cidr   = var.vpc_subnet_cidr
  run_frontend_name = module.compute.run_frontend_name 
  # run_vault_name    = module.compute.run_vault_name 
  run_names         = module.compute.run_names
  domain            = var.domain
  subdomains        = var.subdomains
}


module "datalake" {
  source      = "./modules/datalake"
  proj_name   = var.proj_name
  proj_id     = var.proj_id
  proj_number = var.proj_number
  location    = var.location
  region      = var.region
  tag_owner   = var.tag_owner
  enabled_apis= google_project_service.apis
#   tag_env     = var.tag_env
}

module "iam" {
  source        = "./modules/iam"
  proj_name     = var.proj_name
  proj_id       = var.proj_id
  proj_number   = var.proj_number
  location      = var.location
  region        = var.region
  run_portfolio = module.compute.run_portfolio
  # run_fastapi   = module.compute.run_fastapi
}

module "compute" {
  source            = "./modules/compute"
  proj_name         = var.proj_name
  proj_id           = var.proj_id
  proj_number       = var.proj_number
  region            = var.region
  location          = var.location
  run_connector_id  = module.network.run_connector_id        #####################
  # vault_bucket_name = module.datalake.vault_bucket_name
  # vault_backup_bucket_name = module.datalake.vault_backup_bucket_name
  # vault_backup_function_name = module.datalake.vault_backup_function_name
  # vault_backup_func_sa_email = module.datalake.vault_backup_func_sa_email
  grafana_bucket_name = module.datalake.grafana_bucket_name
  portfolio_run_sa_email = module.iam.portfolio_run_sa_email
  fastapi_run_sa_email = module.iam.fastapi_run_sa_email
}


# # Enable necessary APIs
# resource "google_project_service" "cloudbuild_api" {
#   service = "cloudbuild.googleapis.com"
#   disable_on_destroy = false
# }

# resource "google_project_service" "source_api" {
#   service = "sourcerepo.googleapis.com"
#   disable_on_destroy = false
# }

# # Create a service account for Cloud Build
# resource "google_service_account" "cloudbuild_sa" {
#   account_id   = "cloudbuild-sa"
#   display_name = "Cloud Build Service Account"
# }

# # Assign necessary roles to the service account
# resource "google_project_iam_member" "cloudbuild_sa_roles" {
#   for_each = toset([
#     "roles/cloudbuild.builds.builder",
#     "roles/logging.logWriter",
#     "roles/storage.objectAdmin",
#   ])
#   role    = each.key
#   member  = "serviceAccount:${google_service_account.cloudbuild_sa.email}"
#   project = var.proj_id
# }




# Create a Cloud Build trigger for GitHub
# resource "google_cloudbuild_trigger" "github_trigger" {
#   name        = "github-push-trigger"
#   description = "Trigger build on push to main branch"
#   source_to_build {
#     uri       = "https://github.com/${var.github_owner}/${var.github_repo}"
#     ref       = "refs/heads/main"
#     repo_type = "GITHUB"
#   }
#   build {
#     step {
#       name = "gcr.io/cloud-builders/docker"
#       args = ["build", "-t", "gcr.io/$PROJECT_ID/my-app", "."]
#     }
#     step {
#       name = "gcr.io/cloud-builders/docker"
#       args = ["push", "gcr.io/$PROJECT_ID/my-app"]
#     }
#   }
#   depends_on = [
#     google_project_service.cloudbuild_api,
#     google_service_account.cloudbuild_sa,
#   ]
# }
