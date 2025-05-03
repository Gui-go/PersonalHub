




resource "google_storage_bucket" "vault_bucket" {
  project  = var.proj_id
  name     = "${var.proj_id}-vault-bucket"
  location = var.location
  versioning {
    enabled = true
  }
  uniform_bucket_level_access = true
}