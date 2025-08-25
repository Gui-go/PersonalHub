resource "google_service_account" "sa" {
  account_id   = var.service_account_id
  display_name = var.service_account_name
  project      = var.project_id
}

resource "google_storage_bucket_iam_member" "sa_bucket_access" {
  bucket = var.bucket_name
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.sa.email}"
}