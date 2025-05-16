
# resource "google_storage_bucket" "tf_rawbucket" {
#   name          = "${var.proj_name}-raw-bucket"
#   project       = var.proj_id
#   location      = var.location
#   storage_class = "COLDLINE" # NEARLINE COLDLINE ARCHIVE
#   lifecycle_rule {
#     action {
#       type          = "SetStorageClass"
#       storage_class = "ARCHIVE"
#     }
#     condition {
#       age = 180 # Move to ARCHIVE after 180 days
#     }
#   }
#   labels = {
#     environment = "varproj_name"
#     project     = var.proj_id
#     owner       = var.tag_owner
#   }
# }





resource "google_storage_bucket" "vault_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-vault-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

# resource "google_storage_bucket" "rstudio_bucket" {
#   project  = var.proj_id
#   name     = "${var.proj_id}-rstudio-bucket"
#   location = var.location
#   versioning {
#     enabled = true
#   }
#   uniform_bucket_level_access = true
# }

resource "google_storage_bucket" "billing_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-billing-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}


resource "google_bigquery_dataset" "billing_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "billing"
  location      = var.location 
  description   = "BigQuery dataset for Cloud Billing"
}




resource "google_storage_bucket" "database_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-database-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_bigquery_dataset" "database_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "database"
  location      = var.location 
  description   = "BigQuery dataset for Portfolio database"
}


resource "google_bigquery_table" "bq_table_dflocations" {
  project             = var.proj_id
  dataset_id          = google_bigquery_dataset.database_bq_dataset.dataset_id
  table_id            = "df_locations"
  deletion_protection = false
  external_data_configuration {
    source_uris       = ["gs://${var.proj_id}-database-bucket/df_locations.csv"]
    source_format     = "CSV"
    autodetect        = true
  }
}

# 


# resource "google_project_iam_member" "bq_job_user" {
#   project = var.proj_id
#   role    = "roles/bigquery.jobUser"
#   member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
# }



# provider "google-beta" {
#   project     = var.proj_id
#   region      = var.location
#   # credentials = file("./dynamic-run-portfolio1-sa-credential.json")
# }


# DATAFORM ------------------------------------

# resource "google_secret_manager_secret" "gh_token_secret" {
#   secret_id = "gh-access-token-secret"
#   labels = {
#     label = "gh-token123"
#   }
#   replication {
#     user_managed {
#       replicas {
#         location = var.location
#       }
#       # replicas {
#       #   location = "us-east1"
#       # }
#     }
#   }
# }


# data "google_secret_manager_secret_version" "tf_mainuser" {
#   project = var.proj_id
#   secret  = "main-user"
#   version = "latest"
# }

# data "google_secret_manager_secret_version" "tf_mainsecret" {
#   project = var.proj_id
#   secret  = "main-passwd"
#   version = "latest"
# }

# data "google_secret_manager_secret_version" "tf_secretgitprivsshk" {
#   project = var.proj_id
#   secret  = "secret-gcp-ssh-key"
#   version = "latest"
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
#         location = var.location
#       }
#     }
#   }
# }

# resource "google_secret_manager_secret_version" "gh_token_secret_version" {
#   secret      = google_secret_manager_secret.gh_token_secret.id
#   secret_data = var.github_token
# }

# resource "google_secret_manager_secret_iam_member" "dataform_secret_access" {
#   secret_id = google_secret_manager_secret.gh_token_secret.id
#   role      = "roles/secretmanager.secretAccessor"
#   member    = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-dataform.iam.gserviceaccount.com"
# }

# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
# resource "google_dataform_repository" "bqdataform_repository" {
#   provider = google-beta
#   name = "${var.proj_name}-dataform-repo"
#   display_name = "${var.proj_name}-dataform-repo"
#   git_remote_settings {
#       url = "https://github.com/Gui-go/gcp_billing_analytics.git"
#       default_branch = "main"
#       authentication_token_secret_version = "projects/292524820499/secrets/dataform-github-personal-access-token/versions/latest" #TODO
#   }
#   workspace_compilation_overrides {
#     default_database = var.proj_id
#     schema_suffix = ""
#     table_prefix = ""
#   }
#   # depends_on = [google_bigquery_dataset.tf_bqdataset_bronze]
# }

# resource "google_dataform_repository_release_config" "tf_bqdataform_release" {
#   provider = google-beta
#   project    = google_dataform_repository.bqdataform_repository.project
#   region     = google_dataform_repository.bqdataform_repository.region
#   repository = google_dataform_repository.bqdataform_repository.name
#   name          = "my_release"
#   git_commitish = "main"
#   cron_schedule = "0 7 * * *"
#   time_zone     = "America/New_York"
#   code_compilation_config {
#     default_database = "bronze"
#     default_schema   = "bronze"
#     default_location = var.location
#     assertion_schema = "example-assertion-dataset"
#     database_suffix  = ""
#     schema_suffix    = ""
#     table_prefix     = ""
#     vars = {
#       var1 = "value"
#     }
#   }
# }

# resource "google_dataform_repository_workflow_config" "tf_bqdataform_workflow" {
#   provider       = google-beta
#   project        = google_dataform_repository.bqdataform_repository.project
#   region         = google_dataform_repository.bqdataform_repository.region
#   repository     = google_dataform_repository.bqdataform_repository.name
#   name           = "my_workflow"
#   release_config = google_dataform_repository_release_config.tf_bqdataform_release.id
#   invocation_config {
#     included_targets {
#       database = "silver"
#       schema   = "schema1"
#       name     = "target1"
#     }
#     included_targets {
#       database = "gold"
#       schema   = "schema2"
#       name     = "target2"
#     }
#     transitive_dependencies_included         = true
#     transitive_dependents_included           = true
#     fully_refresh_incremental_tables_enabled = false
#     # service_account                          = google_service_account.dataform_sa.email
#   }
#   cron_schedule   = "0 7 * * *"
#   time_zone       = "America/New_York"
# }

# --------------------------------------------------------------