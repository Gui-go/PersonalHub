output "run_frontend_name" {
  value = google_cloud_run_v2_service.run_frontend.name
}

output "run_vault_name" {
  value = google_cloud_run_v2_service.run_vault.name
}

# output "run_names" {
#   value = {
#     frontend = google_cloud_run_v2_service.run_frontend.name,
#     vault    = google_cloud_run_v2_service.run_vault.name,
#   }
# }

output "run_names" {
  value = {
    www               = google_cloud_run_v2_service.run_frontend.name,
    frontend          = google_cloud_run_v2_service.run_frontend.name,
    portfolio         = google_cloud_run_v2_service.run_frontend.name,
    react-portfolio   = google_cloud_run_v2_service.run_frontend.name,
    flutter-portfolio = google_cloud_run_v2_service.run_flutter_portfolio.name
    vault             = google_cloud_run_v2_service.run_vault.name,
    rstudio           = google_cloud_run_v2_service.run_rstudio.name
    wordpress         = google_cloud_run_v2_service.run_frontend.name,
    tom-riddles-diary = google_cloud_run_v2_service.run_frontend.name,
    soi-erasmus       = google_cloud_run_v2_service.run_frontend.name,
    soi-h-index       = google_cloud_run_v2_service.run_frontend.name,
    ollama            = google_cloud_run_v2_service.run_frontend.name,
    flask-api         = google_cloud_run_v2_service.run_frontend.name,
    django-api        = google_cloud_run_v2_service.run_frontend.name,

    # django-portfolio = google_cloud_run_v2_service.run_flutter_portfolio.name,
    # php-portfolio   = google_cloud_run_v2_service.run_frontend.name,

    # postgres          = google_cloud_run_v2_service.run_frontend.name,
    # mongodb          = google_cloud_run_v2_service.run_frontend.name,
    # neo4j          = google_cloud_run_v2_service.run_frontend.name,
    # mariadb          = google_cloud_run_v2_service.run_frontend.name,
    # elasticsearch          = google_cloud_run_v2_service.run_frontend.name,
    # zookeeper          = google_cloud_run_v2_service.run_frontend.name,
    # mysql          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,

    # geoserver          = google_cloud_run_v2_service.run_frontend.name,
    # geonetwork          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    
    
    # airflow          = google_cloud_run_v2_service.run_frontend.name,
    # grafana          = google_cloud_run_v2_service.run_frontend.name,
    # kibana          = google_cloud_run_v2_service.run_frontend.name,
    # cassandra          = google_cloud_run_v2_service.run_frontend.name,
    # opensearch-dashboards          = google_cloud_run_v2_service.run_frontend.name,
    # kafka          = google_cloud_run_v2_service.run_frontend.name,
    # datapreper          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,

    # selenium          = google_cloud_run_v2_service.run_frontend.name,
    # ubuntu          = google_cloud_run_v2_service.run_frontend.name,
    # matlab          = google_cloud_run_v2_service.run_frontend.name,
    # portainer          = google_cloud_run_v2_service.run_frontend.name,
    # zabbix          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,
  }
}
