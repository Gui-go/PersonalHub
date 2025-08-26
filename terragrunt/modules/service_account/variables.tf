variable "service_account_id" {
  description = "ID for the service account"
  type        = string
}

variable "service_account_name" {
  description = "Name for the service account"
  type        = string
}

# variable "bucket_name" {
#   description = "Name of the bucket to grant access to"
#   type        = string
# }
variable "bucket" {
  description = "Map of bucket names to bucket URLs"
  type = map(string)
}

# variable "bucket" {
#   description = "Map of bucket names to their configuration (location, storage class, etc.)"
#   type = map(object({
#     location      = string
#     storage_class = string
#   }))
# }

variable "service_account_email" {
  description = "Email of the service account for IAM assignments"
  type        = string
}



variable "project_id" {
  description = "The GCP project ID"
  type        = string
}