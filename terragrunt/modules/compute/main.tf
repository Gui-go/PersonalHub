
resource "google_vpc_access_connector" "run_connector" {
  project        = var.project_id
  name           = var.run_connector_name
  region         = var.region
  ip_cidr_range  = var.run_connector_ip_cidr_range
  network        = var.vpc_network_id
  min_throughput = 200
  max_throughput = 300
}

resource "google_cloud_run_v2_service" "run_services" {
  for_each = var.run
  project  = var.project_id
  name     = each.key
  location = var.region
  ingress  = each.value.ingress
  template {
    containers {
      image = each.value.image
      ports {
        container_port = each.value.container_port
      }
      resources {
        limits = {
          cpu    = each.value.cpu
          memory = each.value.memory
        }
      }
    }
    scaling {
      max_instance_count = each.value.max_instance_count
      min_instance_count = each.value.min_instance_count
    }
    vpc_access {
      connector = google_vpc_access_connector.run_connector.id
      egress    = each.value.egress
    }
    timeout         = each.value.timeout
    service_account = var.service_account_email
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "run_services_invoker_iam_member" {
  for_each = google_cloud_run_v2_service.run_services
  project  = each.value.project
  service  = each.value.name
  location = each.value.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

