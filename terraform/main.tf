locals {
  proj_name       = "personalhub"
  proj_id         = "personalhub3"
  proj_number     = "353128465181"
  location        = "us-central1"
  zone            = "us-central1-b"
  vpc_subnet_cidr = "10.8.0.0/28"
  domain          = "guigo.dev.br"
  subdomains      = [
    "www", 
    "portfolio", 
    "fastapi", 
    # "vault",
    # "rstudio",
    # "ollama",
    # "tom-riddles-diary",
    # "soi-erasmus",
    # "soi-h-index",
  ]
  release         = "1"
  tag_owner       = "guilhermeviegas"
  tag_env         = "prod"
}


resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "storage.googleapis.com",
    "cloudfunctions.googleapis.com",
    "eventarc.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iam.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "vpcaccess.googleapis.com",
    "eventarc.googleapis.com", # although not used, it is needed for google_cloudfunctions2_function
    "pubsub.googleapis.com",    # although not used, it is needed for google_cloudfunctions2_function
    "bigquery.googleapis.com"
  ])
  project = local.proj_id
  service = each.key
}


provider "google-beta" {
  project     = local.proj_id
  region      = local.location
}

module "network" {
  source            = "./modules/network"
  proj_name         = local.proj_name
  proj_id           = local.proj_id
  location          = local.location
  tag_owner         = local.tag_owner
  vpc_subnet_cidr   = local.vpc_subnet_cidr
  run_frontend_name = module.compute.run_frontend_name 
  # run_vault_name    = module.compute.run_vault_name 
  run_names         = module.compute.run_names
  domain            = local.domain
  subdomains        = local.subdomains
}

module "iam" {
  source        = "./modules/iam"
  proj_name     = local.proj_name
  proj_id       = local.proj_id
  proj_number   = local.proj_number
  location      = local.location
  run_portfolio = module.compute.run_portfolio
  run_fastapi   = module.compute.run_fastapi
}

module "datalake" {
  source    = "./modules/datalake"
  proj_name = local.proj_name
  proj_id   = local.proj_id
  location  = "US" # NOT local.location
  tag_owner = local.tag_owner
  tag_env   = local.tag_env
}

module "datawarehouse" {
  source    = "./modules/datawarehouse"
  proj_name = local.proj_name
  proj_id   = local.proj_id
  location  = local.location
}

module "compute" {
  source              = "./modules/compute"
  proj_name           = local.proj_name
  proj_id             = local.proj_id
  proj_number         = local.proj_number
  location            = local.location
  vpc_network_name    = module.network.vpc_network_name
  fastapi_sa_email    = module.iam.fastapi_sa_email
}

# module "searchengine" {
#   source      = "./modules/searchengine"
#   proj_name   = local.proj_name
#   proj_id     = local.proj_id
#   location    = local.location
#   # zone        = local.zone
#   release     = local.release
#   # tag_env   = local.tag_env
# }
