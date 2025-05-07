# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
resource "google_dataform_repository" "bqdataform_repository" {
  provider = google-beta
  name = "${var.proj_name}-dataform-repo"
  display_name = "${var.proj_name}-dataform-repo"
  git_remote_settings {
      url = "https://github.com/Gui-go/gcp_billing_analytics.git"
      default_branch = "main"
      authentication_token_secret_version = "projects/353128465181/secrets/gh-access-token-secret"
    #   authentication_token_secret_version = "projects/292524820499/secrets/dataform-github-personal-access-token/versions/latest" #TODO
  }
  workspace_compilation_overrides {
    default_database = var.proj_id
    schema_suffix = ""
    table_prefix = ""
  }
  # depends_on = [google_bigquery_dataset.tf_bqdataset_bronze]
}

# resource "google_dataform_repository_release_config" "tf_bqdataform_release" {
#   provider = google-beta
#   project    = google_dataform_repository.bqdataform_repository.project
#   region     = google_dataform_repository.bqdataform_repository.region
#   repository = google_dataform_repository.bqdataform_repository.name
#   name          = "my_release"
#   git_commitish = "main"
#   cron_schedule = "0 7 * * *"
#   time_zone     = "America/New_York"
#   code_compilation_config {
#     default_database = "bronze"
#     default_schema   = "bronze"
#     default_location = var.location
#     assertion_schema = "example-assertion-dataset"
#     database_suffix  = ""
#     schema_suffix    = ""
#     table_prefix     = ""
#     vars = {
#       var1 = "value"
#     }
#   }
# }

# resource "google_dataform_repository_workflow_config" "tf_bqdataform_workflow" {
#   provider       = google-beta
#   project        = google_dataform_repository.bqdataform_repository.project
#   region         = google_dataform_repository.bqdataform_repository.region
#   repository     = google_dataform_repository.bqdataform_repository.name
#   name           = "my_workflow"
#   release_config = google_dataform_repository_release_config.tf_bqdataform_release.id
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
#   time_zone       = "America/New_York"
# }
