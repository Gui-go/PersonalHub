include "root" {
  path = find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")
}

include "dev_common" {
  path = "../terragrunt.hcl"
}

locals {
  gcp_vars = read_terragrunt_config(find_in_parent_folders("terragrunt.hcl", "terragrunt.hcl")).inputs
  # artifact_registry_config = read_terragrunt_config("../artifact_registry/terragrunt.hcl")
}

dependency "bucket_state" {
  config_path = "../bucket_state"
  skip_outputs = true
}

dependency "network" {
  config_path = "../network"
}

dependency "service_account" {
  config_path = "../service_account"
  skip_outputs = false
}

dependency "artifact_registry" {
  config_path = "../artifact_registry"
  skip_outputs = true
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//compute"
}

inputs = {
  project_id            = local.gcp_vars.gcp_project_id
  region                = local.gcp_vars.gcp_region
  run_connector_name    = "cloudrun-connector"
  run_connector_ip_cidr_range = "10.8.0.0/28"
#  vpc_network_id        = dependency.network.outputs.network_id
#  vpc_subnet_id         = dependency.network.outputs.subnet_id
  service_account_email = dependency.service_account.outputs.service_account_email
  artifact_registry_id  = "artifact-repo"
  run = {
    "portfolio-run" = {
      ingress             = "INGRESS_TRAFFIC_ALL"
      egress              = "ALL_TRAFFIC"
      image               = "${local.gcp_vars.gcp_region}-docker.pkg.dev/${local.gcp_vars.gcp_project_id}/artifact-repo/portfolio-app:latest"
      container_port      = 3000
      cpu                 = "1" #"2"
      memory              = "512Mi" #"1024Mi"
      max_instance_count  = 1
      min_instance_count  = 0
      timeout             = "360s"
    }
  }
}



