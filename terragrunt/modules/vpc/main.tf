resource "google_compute_network" "vpc_net" {
  project                 = var.project_id
  name                    = "vpc-net"
  auto_create_subnetworks = true
  # auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "vpc_subnet" {
  project                  = var.project_id
  name                     = "vpc-subnet"
  ip_cidr_range            = var.vpc_subnet_cidr
  network                  = google_compute_network.vpc_net.id
  region                   = var.region
  private_ip_google_access = true
}
