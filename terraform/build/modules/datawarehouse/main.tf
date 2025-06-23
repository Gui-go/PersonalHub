
## Billing Analytics ----------------------------------------------------------------------------------

# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
resource "google_dataform_repository" "bqdataform_billinganalytics_repo" {
  provider = google-beta
  name = "billing-dataform-repo"
  display_name = "Billing Analytics DataForm Repository"
  region     = var.region
  service_account = var.dataform_sa_email
  git_remote_settings {
      url = "https://github.com/Gui-go/gcp_billing_analytics.git"
      default_branch = "main"
      authentication_token_secret_version = var.gh_token_secret
  }
  workspace_compilation_overrides {
    default_database = var.proj_id
    schema_suffix = ""
    table_prefix = ""
  }
  # depends_on = [google_bigquery_dataset.bqdataset_bronze]   ####### dataset source
}



# resource "google_dataform_repository_release_config" "bqdataform_release" {
#   provider = google-beta
#   project    = google_dataform_repository.bqdataform_billinganalytics_repo.project
#   region     = google_dataform_repository.bqdataform_billinganalytics_repo.region
#   repository = google_dataform_repository.bqdataform_billinganalytics_repo.name
#   name          = "my_release"
#   git_commitish = "main"
#   cron_schedule = "0 7 * * *"
#   time_zone     = "America/New_York"
#   code_compilation_config {
#     default_database = "bronze"
#     default_schema   = "bronze"
#     default_region = var.region
#     assertion_schema = "example-assertion-dataset"
#     database_suffix  = ""
#     schema_suffix    = ""
#     table_prefix     = ""
#     vars = {
#       var1 = "value"
#     }
#   }
# }

# resource "google_dataform_repository_workflow_config" "bqdataform_workflow" {
#   provider       = google-beta
#   project        = google_dataform_repository.bqdataform_billinganalytics_repo.project
#   region         = google_dataform_repository.bqdataform_billinganalytics_repo.region
#   repository     = google_dataform_repository.bqdataform_billinganalytics_repo.name
#   name           = "my_workflow"
#   release_config = google_dataform_repository_release_config.bqdataform_release.id
#   invocation_config {
#     included_targets {
#       database = "silver"
#       schema   = "schema1"
#       name     = "target1"
#     }
#     included_targets {
#       database = "gold"
#       schema   = "schema2"
#       name     = "target2"
#     }
#     transitive_dependencies_included         = true
#     transitive_dependents_included           = true
#     fully_refresh_incremental_tables_enabled = false
#     # service_account                          = google_service_account.dataform_sa.email
#   }
#   cron_schedule   = "0 7 * * *"
#   time_zone       = "Etc/GMT"    # Greenwich Mean Time (UTC+0)
# }




## BRvectors ----------------------------------------------------------------------------------

# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
resource "google_dataform_repository" "bqdataform_brvectos_repo" {
  provider = google-beta
  name = "brvectors-dataform-repo"
  display_name = "BR Vectors DataForm Repository"
  region       = var.region
  service_account = var.dataform_sa_email
  git_remote_settings {
      url = "git@github.com:Gui-go/BRvectors.git"
      default_branch = "main"
      authentication_token_secret_version = var.gh_token_secret
  }
  workspace_compilation_overrides {
    default_database = var.proj_id
    schema_suffix = ""
    table_prefix = ""
  }
  # depends_on = [google_bigquery_dataset.bqdataset_bronze]
}


