

output "fastapi_sa_email" {
  value = google_service_account.fastapi_sa.email
}

output "dataform_sa_email" {
  value = google_service_account.customdataform_sa.email
}

