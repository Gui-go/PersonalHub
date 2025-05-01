
resource "google_compute_network" "tf_vpc_net" {
  project                 = var.proj_id
  name                    = "${var.proj_name}-vpc-net"
  auto_create_subnetworks = true
}

resource "google_compute_subnetwork" "tf_vpc_subnet" {
  project                  = var.proj_id
  name                     = "${var.proj_name}-vpc-subnet"
  ip_cidr_range            = var.vpc_subnet_cidr
  network                  = google_compute_network.tf_vpc_net.id
  region                   = var.location
  private_ip_google_access = true
}


# resource "google_compute_address" "tf_static_ip" {
#   project = var.proj_id
#   name         = "${var.proj_name}-static-ip"
#   region       = var.location
# }

# resource "google_dns_managed_zone" "tf_dns_zone" {
#   project = var.proj_id
#   name        = "${var.proj_name}-dns-zone"
#   dns_name    = "guigo.dev.br."
#   description = "My DNS zone"
# }

# resource "google_dns_record_set" "tf_a_record" {
#   project = var.proj_id
#   name         = "guigo.dev.br."
#   managed_zone = google_dns_managed_zone.tf_dns_zone.name
#   type         = "A"
#   ttl          = 300
#   rrdatas      = [google_compute_address.tf_static_ip.address]
# }

# resource "google_dns_record_set" "tf_www_a_record" {
#   project      = var.proj_id
#   name         = "www.guigo.dev.br."
#   managed_zone = google_dns_managed_zone.tf_dns_zone.name
#   type         = "A"
#   ttl          = 300
#   rrdatas      = [google_compute_address.tf_static_ip.address]
# }

