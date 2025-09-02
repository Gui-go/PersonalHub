variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "run" {
  description = "Map of Cloud Run services to create"
  type = map(object({
    ingress             = string
    egress              = string
    image               = string
    container_port      = number
    cpu                 = string
    memory              = string
    max_instance_count  = number
    min_instance_count  = number
    timeout             = string
  }))
}

variable "service_account_email" {
  description = "The email of the service account to use for the Cloud Run service"
  type        = string
}

variable "vpc_network_id" {
  description = "The ID of the VPC network"
  type        = string
}

variable "vpc_subnet_id" {
  description = "The ID of the VPC subnetwork"
  type        = string
}

variable "run_connector_name" {
  description = "The name of the VPC access connector"
  type        = string
}

variable "run_connector_ip_cidr_range" {
  description = "The IP CIDR range for the VPC access connector"
  type        = string
}


