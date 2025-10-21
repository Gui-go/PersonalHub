variable "bucket" {
  description = "Map of bucket names to their configuration (location, storage class, etc.)"
  type = map(object({
    location      = string
    storage_class = string
  }))
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