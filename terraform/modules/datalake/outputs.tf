
output "vault_bucket_name" {
  description = "Name of the GCS Vault bucket"
  value       = google_storage_bucket.vault_bucket.name
}


