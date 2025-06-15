
# Portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_portfolio" {
  project  = var.proj_id
  name     = "portfolio-run"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/portfolio-app:latest"
      ports { container_port = 3000 }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = var.run_connector_id
      egress = "ALL_TRAFFIC"
    }
    timeout = "60s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# FastAPI API ------------------------------------------------------------------------------------------

resource "google_cloud_run_v2_service" "run_fastapi" {
  project  = var.proj_id
  name     = "fastapi-run"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      # image = "guigo13/fastapi-api:latest"
      image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/fastapi-api:latest"
      ports { container_port = 8080 }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = var.run_connector_id
      egress = "ALL_TRAFFIC"
    }
    timeout = "60s"
    # service_account = google_service_account.fastapi_sa.email
    service_account = var.fastapi_sa_email
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}


# vaultwarden ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_vault" {
#   project  = var.proj_id
#   name     = "vault-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "vaultwarden/server:latest"
#       # image = "us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/vault-app:latest"
#       env {
#         name  = "WEBSOCKET_ENABLED"
#         value = "true"
#       }
#       # env {
#       #   name  = "SIGNUPS_ALLOWED"
#       #   value = "false" # Disable if signup is needed          
#       # }
#       env {
#         name  = "SIGNUPS_ALLOWED"
#         value = "true"          
#       }
#       env {
#         name  = "DATA_FOLDER"
#         value = "/data"
#       }
#       env {
#         name  = "DATABASE_URL"
#         value = "sqlite:///data/db.sqlite3"
#       }
#       # env {
#       #   name  = "ADMIN_TOKEN"
#       #   value = var.admin_token
#       # }
#       # env {
#       #   name  = "INVITATIONS_ALLOWED"
#       #   value = "true"
#       # }
      
#       env {
#         name  = "ADMIN_TOKEN"
#         value = "passwd123#"
#       }
#       # env {
#       #   name  = "DATABASE_URL"
#       #   value = "postgresql://user:password@db-host:5432/vaultdb"  # If using PostgreSQL
#       # }
#       # env {
#       #   name  = "DOMAIN"
#       #   value = "https://vault.guigo.dev.br"
#       # }
#       ports {container_port = 80}
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#       volume_mounts {
#         name       = "vault-data"
#         mount_path = "/data"
#       }
#     }
#     volumes {
#       name = "vault-data"
#       gcs {
#         bucket    = var.vault_bucket_name
#         read_only = false
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }


# resource "google_cloud_run_service_iam_member" "vault_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_vault.name
#   location = google_cloud_run_v2_service.run_vault.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# # # BackUp Function 
# # resource "google_cloudfunctions2_function" "run_vault_backup" {
# #   name     = "${var.proj_name}-func-backup"
# #   project  = var.proj_id
# #   location = var.region
# #   # deletion_protection=false
# #   build_config {
# #     runtime     = "python310"
# #     entry_point = "fct_backup_vaultwarden"
# #     source {
# #       storage_source {
# #         bucket = var.vault_backup_bucket_name
# #         object = var.vault_backup_function_name
# #       }
# #     }
# #   }
# #   service_config {
# #     available_memory = "256M"
# #     timeout_seconds  = 60
# #     service_account_email = var.vault_backup_func_sa_email
# #     environment_variables = {
# #       BACKUP_BUCKET = var.vault_backup_bucket_name
# #     }
# #   }
# #   event_trigger {
# #     event_type = "google.cloud.storage.object.v1.finalized"
# #     trigger_region = var.region
# #     event_filters {
# #       attribute = "bucket"
# #       value     = var.vault_bucket_name
# #     }
# #   }
# #   depends_on = [var.vault_backup_function_name]
# # }



# # resource "google_project_iam_member" "gcs_pubsub_publisher" {
# #   project = var.proj_id
# #   role    = "roles/pubsub.publisher"
# #   member  = "serviceAccount:service-${var.proj_number}@gs-project-accounts.iam.gserviceaccount.com"
# #   # depends_on = [google_storage_bucket.vault_bucket]
# #   depends_on = [var.vault_bucket_name]
# # }

# Rstudio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_rstudio" {
  project  = var.proj_id
  name     = "rstudio-run"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/rstudio-app:latest"
      ports { container_port = 8787 }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = var.run_connector_id
      egress = "ALL_TRAFFIC"
    }
    timeout = "60s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "rstudio_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_rstudio.name
  location = google_cloud_run_v2_service.run_rstudio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# -----------------------------------------------------------------






