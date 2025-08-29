# terragrunt.hcl
# Common Terragrunt configuration for all modules and environments.

# Configure remote state to store Terraform state in a GCS bucket.
# The GCS bucket "your-gcp-project-id-tfstate" must be created manually before running terragrunt init.
remote_state {
  backend = "gcs"
  config = {
    bucket   = "personalhub15gcs4state"
    prefix   = "terragrunt/${path_relative_to_include()}"
    project  = "personalhub15"

    location = "US"
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

# Generate a common provider configuration for all modules.
# This avoids repeating the provider block in every module's terragrunt.hcl.
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "google" {
  project = "personalhub15"
  region  = "us-central1"
}
EOF
}
