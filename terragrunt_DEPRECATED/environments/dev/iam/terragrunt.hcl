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
  source = "${get_repo_root()}/terragrunt/modules//iam"
}

inputs = {
  project_id = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
  bucket_iam = {
    "personalhub15-raw" = {
      member = "personalhub15-dev-sa@personalhub15.iam.gserviceaccount.com"
      role   = "roles/storage.admin"
    }
    # "personalhub15-mart" = {
    #   member = "US"
    #   role   = "roles/storage.admin"
    # }
  }
}






