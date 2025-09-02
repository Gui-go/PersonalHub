resource "google_cloud_run_v2_service" "run_portfolio" {
  project  = var.project_id
  name     = var.app_name
  location = var.region
  ingress  = var.ingress
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_id}/${var.app_name}:latest"
      ports { container_port = var.port }
      resources {
        limits = {
          cpu    = var.cpu # "2"  # "1"
          memory = var.memory # "1024Mi" #"2048Mi" # "1024Mi" # "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = var.max_instance # 1 # 1
      min_instance_count = var.min_instance # 0 
    }
    vpc_access {
      connector = var.run_connector
      egress = var.egress
    }
    timeout = var.timeout
    service_account = var.service_account
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}
