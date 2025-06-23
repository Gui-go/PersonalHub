release         = "v0.0.1"
proj_name       = "personalhub"
proj_id         = "personalhub14"
proj_number     = "415088972722"
location        = "US" # location > region > zone
region          = "us-central1" # us-central1 is the 3rd cheapest on average and has all resources.
zone            = "us-central1-b"
vpc_subnet_cidr = "10.8.0.0/28"   # cicd
domain          = "guigo.dev.br"
subdomains      = [
    "www", 
    # "api", 
    # "rstudio", 
    # "grafana"
  ]
tag_owner       = "guilhermeviegas"
tag_env         = "prod"
github_owner    = "Gui-go"
github_repo     = "PersonalHub"




