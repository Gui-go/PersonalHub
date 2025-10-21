locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
  network_id = dependency.network.outputs.network_id
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//app_run"
}

dependency "storage" {
  config_path = "../storage"
  skip_outputs = true
}

dependency "network" {
  config_path = "../network"
  skip_outputs = true
}

inputs = {
  project_id    = local.parent_vars.inputs.project_id
  region        = local.parent_vars.inputs.region
  lb_ip_id      = dependency.network.outputs.lb_ip_id
  lb_ip_address = dependency.network.outputs.lb_ip_address
  dns_zone_name = dependency.network.outputs.dns_zone_name
  repo_id       = dependency.storage.outputs.repo_id
  network_id    = dependency.network.outputs.network_id
  apps = {
    "portfolio" = {
      app_id          = "portfolio-app"
      app_name        = "portfolio-app"
      app_desc        = "portfolio-app"
      ingress         = "INGRESS_TRAFFIC_ALL"
      port            = 3000
      cpu             = "1"
      memory          = "512Mi" # "1024Mi" "2048Mi"
      min_instance    = 0
      max_instance    = 1
      subdomain       = "www"
      domain          = "guigo.dev.br"
      connector_name  = "cloudrun-connector"
      ip_cidr         = "192.168.16.0/28"
      egress          = "ALL_TRAFFIC"
      timeout         = "360s"
      service_account = ""
      cloud_run_iam = {
        service = "portfolio-app"
        role    = "roles/run.invoker"
      }
    }
    # "fastapi-app" = {
    #   app_id   = "fastapi-app"
    #   app_name = "fastapi-app"
    #   app_desc = "fastapi-app"
    # }
  }
}


