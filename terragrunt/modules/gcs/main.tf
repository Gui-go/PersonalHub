resource "google_storage_bucket" "buckets" {
  for_each      = var.bucket
  project       = var.project_id
  name          = each.key
  location      = each.value.location
  storage_class = each.value.storage_class
  force_destroy                = false
  uniform_bucket_level_access  = true
  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      project
      # labels,
      # effective_labels,
      # versioning,
      # public_access_prevention,
      # rpo,
      # soft_delete_policy,
      # enable_object_retention,
      # default_event_based_hold
    ]
  }
}

