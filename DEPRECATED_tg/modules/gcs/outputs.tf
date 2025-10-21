output "bucket_urls" {
  value = { for k, v in google_storage_bucket.buckets : k => v.name }
}

output "bucket_names" {
  value = [for b in google_storage_bucket.buckets : b.name]
}
