include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
  expose = true
}

dependency "storage" {
  config_path = "../bucket_state"
  skip_outputs = true
}

terraform {
  source = "${get_repo_root()}//terragrunt/modules/storage"
}

# inputs = {
#   bucket_name = "personalhub15-dev-storage"
#   project_id  = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
# }

inputs = {
  project_id = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id

  bucket = {
    "personalhub15-raw" = {
      location      = "US"
      storage_class = "STANDARD"
    }
    "personalhub15-mart" = {
      location      = "US"
      storage_class = "STANDARD"
    }
  }
}

