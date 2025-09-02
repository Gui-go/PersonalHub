resource "google_service_account" "sa" {
  for_each     = var.sa
  project      = var.project_id
  account_id   = each.value.sa_id
  display_name = each.value.sa_name
  description  = each.value.sa_desc
}

# resource "google_storage_bucket_iam_member" "sa_bucket_access" {
#   for_each = toset(var.bucket)
#   bucket   = each.value
#   member   = "serviceAccount:${google_service_account.sa.email}"
#   role     = "roles/storage.admin"
# }
