locals {
  release         = "build11"
  proj_name       = "personalhub"
  proj_id         = "personalhub13"
  proj_number     = "241432738087"

  location        = "US"
  region          = "us-central1" # us-central1 is the 3rd cheapest on average and has all resources.
  zone            = "us-central1-b"
  vpc_subnet_cidr = "10.8.0.0/28"
  domain          = "guigo.dev.br"
  subdomains      = [
    "www", 
    "fastapi", 
    "rstudio"
    # "vault",
    # "ollama",
    # "tom-riddles-diary",
    # "soi-erasmus",
    # "soi-h-index",
  ]
  tag_owner       = "guilhermeviegas"
  tag_env         = "prod"
}

# location > region > zone


provider "google" {
  project     = local.proj_number
  region      = local.location
  credentials = file("terraform-sa-key.json")
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
    "bigquery.googleapis.com",
    "discoveryengine.googleapis.com",
    "artifactregistry.googleapis.com"
    # vertexAI
  ])
  project = local.proj_id
  service = each.key
  disable_on_destroy = false
}


provider "google-beta" {
  project     = local.proj_id
  region      = local.location
}

module "network" {
  source            = "./modules/network"
  proj_name         = local.proj_name
  proj_id           = local.proj_id
  region            = local.region
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
  region        = local.region  
  run_portfolio = module.compute.run_portfolio
  run_fastapi   = module.compute.run_fastapi
}

module "datalake" {
  source      = "./modules/datalake"
  proj_name   = local.proj_name
  proj_id     = local.proj_id
  proj_number = local.proj_number
  location    = local.location
  region      = local.region
  tag_owner   = local.tag_owner
  tag_env     = local.tag_env
}

module "storage" {
  source         = "./modules/storage"
  proj_name      = local.proj_name
  proj_id        = local.proj_id
  proj_number    = local.proj_number
  location       = local.location
  region         = local.region
  vpc_network_id = module.network.vpc_network_id
  vpc_connection_id = module.network.vpc_connection_id
  tag_owner      = local.tag_owner
  tag_env        = local.tag_env
}

module "datawarehouse" {
  source            = "./modules/datawarehouse"
  proj_name         = local.proj_name
  proj_id           = local.proj_id
  proj_number       = local.proj_number
  region            = local.region
  dataform_sa_email = module.iam.dataform_sa_email
  gh_token_secret   = module.security.gh_token_secret
}

module "compute" {
  source            = "./modules/compute"
  proj_name         = local.proj_name
  proj_id           = local.proj_id
  proj_number       = local.proj_number
  region            = local.region
  location          = local.location
  run_connector_id  = module.network.run_connector_id
  # vault_bucket_name = module.datalake.vault_bucket_name
  # vault_backup_bucket_name = module.datalake.vault_backup_bucket_name
  # vault_backup_function_name = module.datalake.vault_backup_function_name
  # vault_backup_func_sa_email = module.datalake.vault_backup_func_sa_email
  portfolio_sa_email = module.iam.portfolio_sa_email
  fastapi_sa_email = module.iam.fastapi_sa_email
}

module "discovery" {
  source      = "./modules/discovery"
  proj_name   = local.proj_name
  proj_id     = local.proj_id
  # region      = local.region
  release     = local.release
  # zone        = local.zone
  # tag_env   = local.tag_env
}

module "security" {
  source      = "./modules/security"
  proj_id     = local.proj_id
  proj_number = local.proj_number
  region      = local.region
  tag_owner   = local.tag_owner
  tag_env     = local.tag_env
}



