
# buckets ------------------------------------------------------------------------------------

resource "google_storage_bucket" "vault_bucket" {
  project                     = var.proj_id
  name                        = "vault-bucket-${var.proj_id}"
  location                    = var.location
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "billing_bucket" {
  project                     = var.proj_id
  name                        = "billing-bucket-${var.proj_id}"
  location                    = var.location
  uniform_bucket_level_access = true
}

resource "google_storage_bucket" "brvectors_bucket" {
  project                     = var.proj_id
  name                        = "brvectors-bucket-${var.proj_id}"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "geolayers_bucket" {
  project                     = var.proj_id
  name                        = "geolayers-bucket-${var.proj_id}"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}



# datasets ------------------------------------------------------------------------------------

# resource "google_bigquery_dataset" "billing_bq_dataset" {
#   project       = var.proj_id
#   dataset_id    = "billing_source"
#   location      = "US"
#   description   = "BigQuery dataset for Cloud Billing dumping"
# }

resource "google_bigquery_dataset" "billing_dev_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "billing_dev"
  location      = "US"
  # criar location, region, and zone at .env
  # location      = var.location 
  description   = "BigQuery dataset in development stage for Cloud Billing dumping"
}

resource "google_bigquery_dataset" "billing_prod_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "billing_prod"
  location      = "US"
  # criar location, region, and zone at .env
  # location      = var.location 
  description   = "BigQuery dataset in production stage for Cloud Billing dumping"
}


resource "google_bigquery_dataset" "brvectors_source_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_source"
  location      = "US"
  # location      = var.location 
  description   = "BigQuery dataset for BRvectors sources"
}

resource "google_bigquery_dataset" "brvectors_dev_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_dev"
  location      = "US"
  # location      = var.location 
  description   = "BigQuery dataset in developement stage for BRvectors"
}

resource "google_bigquery_dataset" "brvectors_prod_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_prod"
  location      = "US"
  # location      = var.location 
  description   = "BigQuery dataset in production stage for BRvectors"
}


resource "google_bigquery_table" "bq_table_dflocations" {
  project             = var.proj_id
  dataset_id          = google_bigquery_dataset.brvectors_source_bq_dataset.dataset_id
  table_id            = "df_locations"
  deletion_protection = false
  external_data_configuration {
    source_uris       = ["gs://${google_storage_bucket.brvectors_bucket.name}/df_locations.csv"]
    source_format     = "CSV"
    autodetect        = true
  }
}


# GeoLayers -----------------------------------------

# Define the BigQuery dataset
resource "google_bigquery_dataset" "geolayers_bq_dataset" {
  project     = var.proj_id
  dataset_id  = "geolayers"
  location    = var.location
  description = "BigQuery dataset for GeoLayers"
}

# Define the BigQuery table
resource "google_bigquery_table" "cities_ivebeen" {
  project             = var.proj_id
  dataset_id          = google_bigquery_dataset.geolayers_bq_dataset.dataset_id
  table_id            = "cities_ivebeen"
  deletion_protection = false
  external_data_configuration {
    source_uris   = ["gs://${google_storage_bucket.geolayers_bucket.name}/cities_ivebeen.csv"]
    source_format = "CSV"
    autodetect    = true
    compression   = "NONE"
  }
  schema = jsonencode([
    {
      "name": "id",
      "type": "INTEGER",
      "mode": "REQUIRED"
    },
    {
      "name": "name",
      "type": "STRING",
      "mode": "NULLABLE"
    },
    {
      "name": "geom",
      "type": "GEOGRAPHY", # For POINT geometry
      "mode": "NULLABLE"
    }
  ])
  # Ensure the dataset is created before the table
  depends_on = [google_bigquery_dataset.geolayers_bq_dataset]
}



# resource "google_bigquery_dataset" "geolayers_bq_dataset" {
#   project       = var.proj_id
#   dataset_id    = "geolayers"
#   # location      = "US"
#   location      = var.location 
#   description   = "BigQuery dataset for GeoLayers"
# }



# resource "google_bigquery_table" "cities_ivebeen2" {
#   project             = var.proj_id
#   dataset_id = var.proj_id
#   table_id   = "cities_ivebeen"
#   # schema = jsonencode([
#   #   { "name": "id", "type": "INTEGER", "mode": "REQUIRED" },
#   #   { "name": "name", "type": "STRING", "mode": "NULLABLE" },
#   #   { "name": "geom", "type": "GEOGRAPHY", "mode": "NULLABLE" }
#   # ])
#   external_data_configuration {
#     source_uris       = ["gs://${google_storage_bucket.geolayers_bucket.name}/cities_ivebeen.csv"]
#     source_format     = "CSV"
#     autodetect        = true
#   }
#   deletion_protection = false
# }







# resource "google_bigquery_table" "bq_table_dflocations" {
#   project             = var.proj_id
#   dataset_id          = google_bigquery_dataset.brvectors_source_bq_dataset.dataset_id
#   table_id            = "df_locations"
#   deletion_protection = false
#   external_data_configuration {
#     source_uris       = ["gs://${google_storage_bucket.brvectors_bucket.name}/df_locations.csv"]
#     source_format     = "CSV"
#     autodetect        = true
#   }
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

# resource "google_storage_bucket" "rstudio_bucket" {
#   project  = var.proj_id
#   name     = "${var.proj_id}-rstudio-bucket"
#   location = var.location
#   versioning {
#     enabled = true
#   }
#   uniform_bucket_level_access = true
# }




