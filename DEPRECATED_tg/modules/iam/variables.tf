variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "bucket_iam" {
  description = "Map of bucket names to their IAM configuration"
  type = map(object({
    member = string
    role   = string
  }))
}




