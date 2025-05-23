variable "proj_name" {
  description = "Project name"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "location" {
  description = "Location of the resources"
  type        = string
}

# variable "tag_owner" {
#   description = "Tag to describe the owner of the resources"
#   type        = string
# }

# variable "vault_bucket_name" {
#   description = "Vaultwarden bucket name"
#   type        = string
# }

variable "run_connector_id" {
  description = "Cloud Run Connector ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project Number identifier"
  type        = string
}

variable "fastapi_sa_email" {
  description = "FastAPI Service Account email"
  type        = string
}


