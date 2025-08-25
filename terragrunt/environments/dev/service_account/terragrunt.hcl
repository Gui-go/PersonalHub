include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../../terraform/modules/service_account"
}

dependency "storage" {
  config_path = "../"
  mock_outputs = {
    bucket_url = "mock-bucket-url"
  }
}

inputs = merge(
  yamldecode(file("${get_terragrunt_dir()}/../../../terraform/common.tfvars")),
  yamldecode(file("${get_terragrunt_dir()}/env.tfvars")),
  {
    bucket_name = dependency.storage.outputs.bucket_url
  }
)