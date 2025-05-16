


resource "google_artifact_registry_repository" "artifact_repo" {
  project       = var.proj_id
  repository_id = "${var.proj_name}-artifact-repo"
  description   = "Artifact registry repository for ${var.proj_name}"
  location      = var.location
  format        = "DOCKER"
  docker_config {
    immutable_tags = false
  }
}

resource "google_vpc_access_connector" "connector" {
  project        = var.proj_id
  name           = "cloudrun-connector"
  region         = var.location
  ip_cidr_range  = "192.168.16.0/28"
  network        = var.vpc_network_name
  min_throughput = 200
  max_throughput = 300
}


# Portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_portfolio" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-portfolio"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/portfolio-app:latest"
      # command = ["npm", "start"]
      ports {
        container_port = 3000
      }
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
      connector = google_vpc_access_connector.connector.id
      egress = "ALL_TRAFFIC"
    }
    timeout = "60s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "portfolio_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_portfolio.name
  location = google_cloud_run_v2_service.run_portfolio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# FastAPI API ------------------------------------------------------------------------------------------

resource "google_service_account" "cloud_run_sa" {
  project      = var.proj_id
  account_id   = "${var.proj_name}-run-sa"
  display_name = "${var.proj_name}-run-sa"
}

# IAM permissions for BigQuery
resource "google_project_iam_member" "bigquery_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "bigquery_admin" {
  project = var.proj_id
  role    = "roles/bigquery.admin"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "storage_object_viewer" {
  project = var.proj_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_cloud_run_v2_service" "run_fastapi" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-fastapi"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/fastapi-api:latest"
      ports {
        container_port = 8080
      }
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
      connector = google_vpc_access_connector.connector.id
      egress = "ALL_TRAFFIC"
    }
    timeout = "60s"
    service_account = google_service_account.cloud_run_sa.email
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# Allow unauthenticated access (optional, remove if authentication is required)
resource "google_cloud_run_service_iam_member" "public_access" {
  project  = var.proj_id
  location = var.location
  service  = google_cloud_run_v2_service.run_fastapi.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}



# flutter-portfolio ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_flutter_portfolio" {
#   project  = var.proj_id
#   name     = "${var.proj_name}-run-flutter-portfolio"
#   location = var.location
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/flutter-portfolio:latest"
#       ports {
#         container_port = 8080
#       }
#       resources {
#         limits = {
#           cpu    = "0.5"
#           memory = "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     vpc_access {
#       connector = google_vpc_access_connector.connector.id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "120s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }

# resource "google_cloud_run_service_iam_member" "flutter_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_flutter_portfolio.name
#   location = google_cloud_run_v2_service.run_flutter_portfolio.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }


# vaultwarden ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_vault" {
#   project  = var.proj_id
#   name     = "${var.proj_name}-run-vault"
#   location = var.location
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
#   name     = "${var.proj_name}-run-rstudio"
#   location = var.location
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/rstudio-app:latest"
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
#       connector = google_vpc_access_connector.connector.id
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




