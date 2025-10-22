locals {
  common_vars_path = try(find_in_parent_folders("common.hcl"), "common.hcl")
  common_vars      = read_terragrunt_config(local.common_vars_path)
}

remote_state {
  backend = "gcs"
  config = {
    bucket   = "personalhub19gcs4state"
    prefix   = "terragrunt/${path_relative_to_include()}"
    project  = local.common_vars.inputs.project_id
    location = local.common_vars.inputs.location
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  # disable_init_prompt = true
}

# Generate a common provider configuration for all modules.
# This avoids repeating the provider block in every module's terragrunt.hcl.
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
  provider "google" {
    project = "${local.common_vars.inputs.project_id}"
    region  = "${local.common_vars.inputs.region}"
  }
  EOF
}

inputs = local.common_vars.inputs

