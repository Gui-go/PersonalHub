variable "bucket_name" {
  description = "Name of the GCS bucket"
  type        = string
}

variable "location" {
  description = "The GCS bucket location"
  type        = string
  default     = "US"
}

variable "project_id" {
  description = "The GCP project ID"
  type        = string
}