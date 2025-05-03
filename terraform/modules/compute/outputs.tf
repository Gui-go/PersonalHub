output "run_frontend_name" {
  value = google_cloud_run_v2_service.run_frontend.name
}

output "run_vault_name" {
  value = google_cloud_run_v2_service.run_vault.name
}

output "run_names" {
  value = {
    www             = google_cloud_run_v2_service.run_frontend.name,
    portfolio       = google_cloud_run_v2_service.run_frontend.name,
    react-portfolio = google_cloud_run_v2_service.run_frontend.name,
    # flutter-portfolio = google_cloud_run_v2_service.run_frontend.name,
    vault           = google_cloud_run_v2_service.run_vault.name,
  }
}
