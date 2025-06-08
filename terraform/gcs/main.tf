locals {
  release         = "1"
  proj_name       = "gcs-personalhub"
  proj_id         = "gcs-personalhub1"
  proj_number     = "858612402377"
  location        = "US"
  region          = "us-central1" # us-central1 is the 3rd cheapest on average and has all resources.
  zone            = "us-central1-b"
  tag_owner       = "guilhermeviegas"
  tag_env         = "prod"
}

provider "google" {
  project     = local.proj_number
  region      = local.location
  # credentials = file("terraform-key.json")
  # credentials = file("path/to/service-account-key.json") # Optional if using ADC
}

resource "google_storage_bucket" "vault_bucket" {
  project                     = local.proj_id
  name                        = "vault-bucket-${local.proj_id}"
  location                    = local.location
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "billing_bucket" {
  project                     = local.proj_id
  name                        = "billing-bucket-${local.proj_id}"
  location                    = local.location
  uniform_bucket_level_access = true
}

resource "google_storage_bucket" "brvectors_bucket" {
  project                     = local.proj_id
  name                        = "brvectors-bucket-${local.proj_id}"
  location                    = local.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "geolayers_bucket" {
  project                     = local.proj_id
  name                        = "geolayers-bucket-${local.proj_id}"
  location                    = local.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "discovery_bucket" {
  project                     = local.proj_id
  name                        = "discovery-bucket-${local.proj_id}"
  location                    = local.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}




resource "google_storage_bucket_iam_member" "iam_member_viewer" {
  bucket = google_storage_bucket.brvectors_bucket.name
  role   = "roles/storage.objectViewer"
  member = "user:gui.viegas.dev@gmail.com"
  depends_on = [google_storage_bucket.brvectors_bucket]
}