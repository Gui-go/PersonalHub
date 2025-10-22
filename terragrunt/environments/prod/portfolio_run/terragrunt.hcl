
locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
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
  project_id    = try(local.parent_vars.inputs.project_id, null)
  region        = try(local.parent_vars.inputs.region, null)
  lb_ip_id      = try(dependency.network.outputs.lb_ip_id, null)
  lb_ip_address = try(dependency.network.outputs.lb_ip_address, null)
  dns_zone_name = try(dependency.network.outputs.dns_zone_name, null)
  repo_id       = try(dependency.storage.outputs.repo_id, null)
  network_id    = try(dependency.network.outputs.network_id, null)
  apps = {
    "portfolio2" = {
      app_id          = "portfolio-app2"
      app_name        = "portfolio-app2"
      app_desc        = "portfolio-app2"
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
        service = "portfolio-app2"
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


