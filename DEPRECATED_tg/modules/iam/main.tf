resource "google_storage_bucket_iam_member" "bucket_iam_member" {
  for_each = var.bucket_iam
  bucket   = each.key
  member   = "serviceAccount:${each.value.member}"
  role     = each.value.role
}




