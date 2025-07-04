
output "gh_token_secret" {
  value       = google_secret_manager_secret.gh_token_secret.name
  description = "The fully qualified name of the GitHub token secret"
  sensitive   = true
}

