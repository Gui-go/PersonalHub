include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
  expose = true
}

dependency "bucket_state" {
  config_path = "../bucket_state"
  skip_outputs = true
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//bq_dataset"
}

inputs = {
  dataset_id   = "billing_export"
  dataset_name = "Billing Export"
  dataset_desc = "Dataset for the Billing Export data"
  location     = "US"
  project_id   = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
}

