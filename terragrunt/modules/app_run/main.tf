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
          cpu    = var.cpu
          memory = var.memory
        }
      }
    }
    scaling {
      max_instance_count = var.max_instance
      min_instance_count = var.min_instance
    }
    vpc_access {
      connector = google_vpc_access_connector.run_connector.id
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

resource "google_vpc_access_connector" "run_connector" {
  project        = var.project_id
  name           = var.connector_name
  region         = var.region
  ip_cidr_range  = var.ip_cidr
  network        = var.network_id
  min_throughput = 200
  max_throughput = 300
}

resource "google_cloud_run_service_iam_member" "run_invoker_iam_member" {
  for_each = {
    for sa_key, sa_val in var.sa :
    sa_key => sa_val
    if contains(keys(sa_val), "cloud_run_iam")
  }
  project  = var.project_id
  service  = each.value.cloud_run_iam.service[0]
  location = var.region
  role     = each.value.cloud_run_iam.role[0]
  member   = "allUsers"
}


