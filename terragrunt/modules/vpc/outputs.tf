output "network_id" {
  value = google_compute_network.vpc_net.id
}

output "subnet_id" {
  value = google_compute_subnetwork.vpc_subnet.id
}
