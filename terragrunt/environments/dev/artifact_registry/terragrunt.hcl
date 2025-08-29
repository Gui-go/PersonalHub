include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
  expose = true # Expose inputs from dev_common
}

locals {
  gcp_vars = include.dev_common.inputs
}

dependency "bucket_state" {
  config_path = "../bucket_state"
  skip_outputs = true
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//artifact_registry"
}

inputs = {
  project_id = local.gcp_vars.gcp_project_id
  region     = local.gcp_vars.gcp_region
  repo_id    = "artifact-repo"
  repo_desc  = "Docker repository for storing container images"
  keep_count = 1
}
