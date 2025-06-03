
# Portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_portfolio" {
  project  = var.proj_id
  name     = "portfolio-run"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      # image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/portfolio-app:latest"
      image = "guigo13/portfolio-app:latest"
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
      image = "guigo13/fastapi-api:latest"
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
#       env {
#         name  = "WEBSOCKET_ENABLED"
#         value = "true"
#       }
#       env {
#         name  = "SIGNUPS_ALLOWED"
#         value = "false" # Disable if signup is needed          
#       }
#       ports {container_port = 80}
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#       volume_mounts {
#         name       = "vaultwarden-data"
#         mount_path = "/data"
#       }
#     }
#     volumes {
#       name = "vaultwarden-data"
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



# Rstudio ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_rstudio" {
#   project  = var.proj_id
#   name     = "rstudio-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/rstudio-app:latest"
#       # command = ["rstudio-server"]
#       ports { container_port = 8787 }
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     vpc_access {
#       connector = var.run_connector_id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }

# resource "google_cloud_run_service_iam_member" "rstudio_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_rstudio.name
#   location = google_cloud_run_v2_service.run_rstudio.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }




