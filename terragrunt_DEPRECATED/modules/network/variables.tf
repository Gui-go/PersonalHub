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

variable "subdomains" {
  description = "A list of subdomains to create."
  type        = list(string)
}

variable "proj_id" {
  description = "The GCP project ID."
  type        = string
}

variable "run_names" {
  description = "A map of Cloud Run service names, with keys matching the subdomains."
  type        = map(string)
}

variable "domain" {
  description = "The domain name."
  type        = string
}



variable "vpc_network_name" {
  description = "The name of the VPC network"
  type        = string
}
