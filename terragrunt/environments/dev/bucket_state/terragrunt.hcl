include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
  expose = true # Expose inputs from dev_common
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//gcs"
}

inputs = {
  project_id = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
  bucket = {
    "personalhub15gcs4state4dev" = {
      location      = "US"
      storage_class = "STANDARD"
    }
  }
}



