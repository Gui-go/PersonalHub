
resource "google_artifact_registry_repository" "tf_artifact_repo" {
  project       = var.proj_id
  repository_id = "${var.proj_name}-artifact-repo"
  description   = "Artifact registry repository for ${var.proj_name}"
  location      = var.location
  format        = "DOCKER"
  docker_config {
    immutable_tags = true
  }
}



# resource "google_cloud_run_v2_service" "tf_toms_ollama" {
#   name     = "toms-ollama"
#   location = local.region
#   ingress = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
#   template {
#     containers {
#       image = "gcr.io/tom-riddle-diary1/ollama"
#       command = ["/bin/sh", "-c", "ollama serve"]
#       ports {
#         container_port = 11434
#       }
#       resources {
#         limits = {
#           cpu    = "4"
#           memory = "16Gi"
#           # "nvidia.com/gpu" = "1"
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
#     # node_selector {
#     #   accelerator = "nvidia-l4"
#     # }
#     # gpu_zonal_redundancy_disabled = true
#     # dynamic "node_selector" {
#     #   for_each = local.enable_gpu ? [1] : []
#     #   content {
#     #     accelerator = local.gpu_type
#     #   }
#     # }
#     # gpu_zonal_redundancy_disabled = local.enable_gpu ? false : true
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }



