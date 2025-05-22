
# output "service_account_key_json" {
#   value     = google_service_account_key.github_actions_deployer_key.private_key
#   sensitive = true
# }

output "gh_token_secret_name" {
  value       = google_secret_manager_secret.gh_token_secret.name
  description = "The fully qualified name of the GitHub token secret"
  sensitive   = true
}

# output "gh_token_secret_address" {
#   value       = "projects/${var.proj_number}/secrets/${google_secret_manager_secret.gh_token_secret.name}/versions/latest"
#   description = "The secret version used by the Dataform repository"
# }

# # Output the service account key (sensitive)
# output "service_account_key_json" {
#   value     = google_service_account_key.github_actions_deployer_key.private_key
#   sensitive = true
# }


# output "fastapi_sa_key_json" {
#   value     = base64decode(google_service_account_key.fastapi_sa_key.private_key)
#   sensitive = true
#   description = "The JSON key for the fastapi-sa service account"
# }


