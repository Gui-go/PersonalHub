# environments/dev/terragrunt.hcl
include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "/home/guigo/Documents/01-personalHub/terragrunt/modules/storage"
}

inputs = {
  bucket_name = "personalhub15gcs4state"
  location    = "us-central1"
}
