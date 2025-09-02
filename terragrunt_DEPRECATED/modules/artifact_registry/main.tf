resource "google_artifact_registry_repository" "artifact_repository" {
  project       = var.project_id
  location      = var.region
  repository_id = var.repo_id
  description   = var.repo_desc
  format        = "DOCKER"
  cleanup_policies {
    id     = "keep-recent-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = var.keep_count
    }
  }
}

# resource "null_resource" "push_initial_images" {
#   depends_on = [google_artifact_registry_repository.artifact_repository]
#   provisioner "local-exec" {
#     working_dir = "${path.root}/../../../" 
#     command = <<EOT
#       gcloud auth configure-docker ${var.region}-docker.pkg.dev -q
#       docker buildx build --platform linux/amd64 \
#         -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_id}/portfolio-app:latest \
#         -f portfolio_app/portfolio-app.dockerfile \
#         --push portfolio_app/
#     EOT
#   }
# }



