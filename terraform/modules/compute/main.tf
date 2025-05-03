
resource "google_artifact_registry_repository" "artifact_repo" {
  project       = var.proj_id
  repository_id = "${var.proj_name}-artifact-repo"
  description   = "Artifact registry repository for ${var.proj_name}"
  location      = var.location
  format        = "DOCKER"
  docker_config {
    immutable_tags = true
  }
}


# Frontend ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_frontend" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-frontend"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/frontend-app:latest"
      command = ["npm", "start"]
      ports {
        container_port = 3000
      }
      resources {
        limits = {
          cpu    = "4"
          memory = "8Gi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    # vpc_access {
    #   connector = google_vpc_access_connector.connector.id
    #   egress = "ALL_TRAFFIC"
    # }
    timeout = "120s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "frontend_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_frontend.name
  location = google_cloud_run_v2_service.run_frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# vaultwarden ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_vault" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-vault"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "vaultwarden/server:latest"
      env {
        name  = "WEBSOCKET_ENABLED"
        value = "true"
      }
      env {
        name  = "SIGNUPS_ALLOWED"
        value = "false" # Disable if signup is needed          
      }
      ports {container_port = 80}
      resources {
        limits = {
          cpu    = "1"
          memory = "2Gi"
        }
      }
      volume_mounts {
        name       = "vaultwarden-data"
        mount_path = "/data"
      }
    }
    volumes {
      name = "vaultwarden-data"
      gcs {
        bucket    = var.vault_bucket_name
        read_only = false
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    timeout = "120s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}


resource "google_cloud_run_service_iam_member" "vault_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_vault.name
  location = google_cloud_run_v2_service.run_vault.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}








