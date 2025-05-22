





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


