variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "vpc_subnet_cidr" {
  description = "CIDE subnetwork for the VPC"
  type        = string
}

