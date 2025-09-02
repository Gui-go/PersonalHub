resource "google_service_account" "sa" {
  account_id   = var.service_account_id
  display_name = var.service_account_name
  project      = var.project_id
}

resource "google_storage_bucket_iam_member" "sa_bucket_access" {
  for_each = toset(var.bucket)
  bucket   = each.value
  member   = "serviceAccount:${google_service_account.sa.email}"
  role     = "roles/storage.admin"
}




