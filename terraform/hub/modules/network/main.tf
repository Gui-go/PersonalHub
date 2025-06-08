
resource "google_compute_network" "vpc_net" {
  project                 = var.proj_id
  name                    = "${var.proj_name}-vpc-net"
  auto_create_subnetworks = true
}

resource "google_compute_subnetwork" "vpc_subnet" {
  project                  = var.proj_id
  name                     = "${var.proj_name}-vpc-subnet"
  ip_cidr_range            = var.vpc_subnet_cidr
  network                  = google_compute_network.vpc_net.id
  region                   = var.region
  private_ip_google_access = true
}

resource "google_vpc_access_connector" "run_connector" {
  project        = var.proj_id
  name           = "cloudrun-connector"
  region         = var.region
  ip_cidr_range  = "192.168.16.0/28"
  network        = google_compute_network.vpc_net.name
  min_throughput = 200
  max_throughput = 300
}

resource "google_compute_region_network_endpoint_group" "neg_region" {
  for_each              = toset(var.subdomains)
  name                  = "${var.proj_name}-${each.key}-neg"
  region                = var.region
  project               = var.proj_id
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = var.run_names[each.key]
  }
}

resource "google_compute_backend_service" "backend" {
  for_each    = toset(var.subdomains)
  name        = "${var.proj_name}-${each.key}-backend"
  project     = var.proj_id
  protocol    = "HTTPS"
  timeout_sec = 30
  enable_cdn = true
  backend {
    group = google_compute_region_network_endpoint_group.neg_region[each.key].id
  }
  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

resource "google_compute_url_map" "url_map" {
  name            = "url-map"
  project         = var.proj_id
  default_service = google_compute_backend_service.backend[var.subdomains[0]].id # Default backend
  dynamic "host_rule" {
    for_each = var.subdomains
    content {
      hosts        = ["${host_rule.value}.${var.domain}"]
      path_matcher = "${host_rule.value}-matcher"
    }
  }
  dynamic "path_matcher" {
    for_each = var.subdomains
    content {
      name            = "${path_matcher.value}-matcher"
      default_service = google_compute_backend_service.backend[path_matcher.value].id
      path_rule {
        paths   = ["/*"]
        service = google_compute_backend_service.backend[path_matcher.value].id
      }
    }
  }
}

resource "google_compute_url_map" "http_redirect" {
  name    = "http-redirect"
  project = var.proj_id
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "https-proxy"
  project          = var.proj_id
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_certs.id]
  depends_on       = [google_compute_managed_ssl_certificate.ssl_certs]
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_managed_ssl_certificate" "ssl_certs" {
  name    = "ssl-certs"
  project = var.proj_id
  managed {
    domains = [for subdomain in var.subdomains : "${subdomain}.${var.domain}"]
  }
  lifecycle {
    create_before_destroy = true
  }
}

# HTTP Proxy for Redirect
resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "http-proxy"
  project = var.proj_id
  url_map = google_compute_url_map.http_redirect.id
}

# Global IP Address
resource "google_compute_global_address" "lb_ip" {
  name    = "lb-ip"
  project = var.proj_id
}

# HTTPS Forwarding Rule
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name                  = "https-forwarding-rule"
  project               = var.proj_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.https_proxy.id
  ip_address            = google_compute_global_address.lb_ip.id
}

# # HTTP Forwarding Rule for Redirect
resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  name                  = "http-forwarding-rule"
  project               = var.proj_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.http_proxy.id
  ip_address            = google_compute_global_address.lb_ip.id
}

## It may take long to repair if deleted. Takes a while to propagate DNS mappings.
resource "google_dns_managed_zone" "dns_zone" {
  name        = "dns-zone"
  project     = var.proj_id
  dns_name    = "${var.domain}."
  description = "DNS zone for the domain"
}

resource "google_dns_record_set" "subdomain_records" {
  for_each     = toset(var.subdomains)
  name         = "${each.key}.${var.domain}."
  project      = var.proj_id
  managed_zone = google_dns_managed_zone.dns_zone.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.lb_ip.address]
}

