include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
  expose = true # Expose inputs from dev_common
}

dependency "bucket_state" {
  config_path = "../bucket_state"
  skip_outputs = true
}

dependency "buckets_data" {
  config_path = "../buckets_data"
  skip_outputs = false
  mock_outputs = {
    bucket_names = ["mock-bucket-name"]
  }
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//service_account"
}

inputs = {
  service_account_id    = "personalhub15-dev-sa"
  service_account_name  = "personalhub15-dev-sa"
  service_account_email = "personalhub15-dev-sa@personalhub15.iam.gserviceaccount.com"
  project_id            = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
  bucket                = dependency.buckets_data.outputs.bucket_names
}



