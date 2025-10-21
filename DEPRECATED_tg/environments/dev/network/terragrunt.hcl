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
  source = "${get_repo_root()}/terragrunt/modules//network"
}

inputs = {
  vpc_net_name    = "vpc-net"
  vpc_subnet_name = "vpc-subnet"
  vpc_subnet_cidr = "10.0.1.0/24"
  project_id      = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs.gcp_project_id
  region          = include.dev_common.inputs.gcp_region
  subdomains = ["www"]
  # subdomains = ["www", "api"]
  region     = "us-central1"
  proj_id    = "personalhub15"
  domain     = "guigo.dev.br"
  vpc_network_name = "vpc-net"
  run_names = {
    "www" = "www-service"
    # "api" = "api-service"
  }
}










