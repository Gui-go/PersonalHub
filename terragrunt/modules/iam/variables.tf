variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

# variable "sa_id" {
#   description = "ID for the service account"
#   type        = string
# }

# variable "sa_name" {
#   description = "Name for the service account"
#   type        = string
# }

# variable "sa_desc" {
#   description = ""
#   type        = string
# }

variable "sa" {
  description = ""
  type = map(object({
    sa_id   = string
    sa_name = string
    sa_desc = string
  }))
}
# google_service_account.sa["terraform-sa"]
# variable "bucket" {
#   description = "Map of bucket names to their configuration (location, storage class, etc.)"
#   type = map(object({
#     location      = string
#     storage_class = string
#   }))
# }

# variable "service_account_email" {
#   description = "Email of the service account for IAM assignments"
#   type        = string
# }



