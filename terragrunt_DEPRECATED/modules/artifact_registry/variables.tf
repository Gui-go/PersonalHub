variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "repo_id" {
  description = "Repository ID"
  type        = string
  default     = "artifact-repo"
}

variable "repo_desc" {
  description = "Repository description"
  type        = string
  default     = "Docker repository for storing container images"
}

variable "keep_count" {
  description = "The number of images to be kept before deletion"
  type        = number
  default     = 1
}


