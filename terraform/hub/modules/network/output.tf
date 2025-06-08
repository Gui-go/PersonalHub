
output "vpc_network_name" {
  value = google_compute_network.vpc_net.name
}

output "run_connector_id" {
  value = google_vpc_access_connector.run_connector.id
}


