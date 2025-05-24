

# Portfolio ------------------------------------------------------------------------------------------

resource "google_cloud_run_service_iam_member" "portfolio_public_access" {
  project  = var.proj_id
  service  = var.run_portfolio.service
  location = var.run_portfolio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}





# FastAPI API ------------------------------------------------------------------------------------------

resource "google_service_account" "fastapi_sa" {
  project      = var.proj_id
  account_id   = "fastapi-sa"
  display_name = "fastapi-sa"
}

resource "google_project_iam_member" "bigquery_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "bigquery_admin" {
  project = var.proj_id
  role    = "roles/bigquery.admin"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

resource "google_project_iam_member" "storage_object_viewer" {
  project = var.proj_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.fastapi_sa.email}"
}

# Allow unauthenticated access (optional, remove if authentication is required)
resource "google_cloud_run_service_iam_member" "public_access" {
  project  = var.proj_id
  location = var.location
  service  = var.run_fastapi.service
  role     = "roles/run.invoker"
  member   = "allUsers"
}



# BQ Dataform ------------------------------------------------------------------------------------------

resource "google_service_account" "customdataform_sa" {
  project      = var.proj_id
  account_id   = "dataform-sa"
  display_name = "Dataform SA"
}

resource "google_project_iam_member" "customdataform_sa_bigquery_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_secret_manager_secret_accessor" {
  project = var.proj_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_bq_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_bq_table_create" {
  project = var.proj_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

resource "google_project_iam_member" "customdataform_sa_bq_object_viewer" {
  project = var.proj_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
}





# BQ DataForm GCP managed SA ------------------------------------------------------------------------------------------

# DataFrom demands this role to be created for the GCP managed service account
resource "google_project_iam_member" "gcpdataform_sa_token_creator" {
  project = var.proj_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "gcpdataform_sa_secret_manager" {
  project = var.proj_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}


resource "google_project_iam_member" "gcpdataform_sa_bq_data_viewer" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "gcpdataform_sa_bq_data_editor" {
  project = var.proj_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "gcpdataform_sa_bq_job_user" {
  project = var.proj_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
}


# ----------------------

# # Vertex AI connection to use Gemini model in BigQuery:
# resource "google_bigquery_connection" "billing_gemini_connection" {
#   project = var.proj_id
#   location = var.location
#   connection_id = "billing_gemini_connection"
#   friendly_name = "Gemini Connection for Billing Data"
#   description = "Connection to Vertex AI for Gemini model access in BigQuery"
#   cloud_resource {
#     # service_account_id = "bqcx-875513564391-qhlb@gcp-sa-bigquery-condel.iam.gserviceaccount.com"
#   }
#   lifecycle {
#     prevent_destroy = true
#   }
# }

# resource "google_project_iam_member" "vertex_ai_user_binding" {
#   project = var.proj_id
#   role    = "roles/aiplatform.user"
#   member  = "serviceAccount:${google_bigquery_connection.billing_gemini_connection.cloud_resource[0].service_account_id}"
#   depends_on = [google_bigquery_connection.billing_gemini_connection]
# }

# resource "google_project_iam_member" "cx_objViewer" {
#   project = var.proj_id
#   role    = "roles/storage.objectViewer"
#   member  = "serviceAccount:${google_bigquery_connection.billing_gemini_connection.cloud_resource[0].service_account_id}"
#   depends_on = [google_bigquery_connection.billing_gemini_connection]
# }


# resource "google_project_iam_member" "cx_sa_binding" {
#   project = var.proj_id
#   role    = "roles/iam.serviceAccountAdmin"
#   member  = "serviceAccount:${google_bigquery_connection.billing_gemini_connection.cloud_resource[0].service_account_id}"
#   depends_on = [google_bigquery_connection.billing_gemini_connection]
# }


# resource "google_project_iam_member" "cx_admin_binding" {
#   project = var.proj_id
#   role    = "roles/bigquery.connectionAdmin"
#   member  = "serviceAccount:${google_bigquery_connection.billing_gemini_connection.cloud_resource[0].service_account_id}"
#   depends_on = [google_bigquery_connection.billing_gemini_connection]
# }

# resource "google_project_iam_member" "vertex_ai_user" {
#   project = var.proj_id
#   role    = "roles/aiplatform.user"
#   member  = "serviceAccount:${google_bigquery_connection.billing_gemini_connection.cloud_resource[0].service_account_id}"
# }




# --------------------------------------------------------------------
resource "google_project_iam_member" "bigquery_data_viewer123" {
  project = var.proj_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:bqcx-875513564391-jbkt@gcp-sa-bigquery-condel.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "vertex_ai_user" {
  project = var.proj_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:bqcx-875513564391-jbkt@gcp-sa-bigquery-condel.iam.gserviceaccount.com"
}




resource "google_bigquery_connection" "default3332323" {
  connection_id = "my_cloud_resource_connection"
  project       = var.proj_id
  location      = "US"
  cloud_resource {}
}
