# environments/dev/terragrunt.hcl
# This file defines common settings for the 'dev' environment.
# It includes the global root terragrunt.hcl to inherit global configurations.

inputs = {
  gcp_project_id = "personalhub15"
  gcp_region     = "us-central1"
  environment    = "dev"
}

