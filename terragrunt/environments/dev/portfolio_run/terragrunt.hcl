locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//app_run"
}

dependency "storage" {
  config_path = "../storage"
#   skip_outputs = true
}

dependency "network" {
  config_path = "../network"
#   skip_outputs = true
}

inputs = {
  project_id   = local.parent_vars.inputs.project_id
  region       = local.parent_vars.inputs.region
  app_name     = "portfolio-app"
  ingress      = "INGRESS_TRAFFIC_ALL"
  repo_id      = dependency.storage.outputs.repo_id
  port         = 3000
  cpu          = "1"
  memory       = "512Mi" # "1024Mi" "2048Mi"
  min_instance = 0
  max_instance = 1
  connector_name = "cloudrun-connector"
  ip_cidr      = "192.168.16.0/28"
  egress       = "ALL_TRAFFIC"
  timeout      = "360s"
  service_account = ""
  network_id   =  dependency.network.outputs.network_id  # google_compute_network.vpc_net.id
}



