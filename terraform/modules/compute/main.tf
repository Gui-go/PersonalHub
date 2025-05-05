
resource "google_artifact_registry_repository" "artifact_repo" {
  project       = var.proj_id
  repository_id = "${var.proj_name}-artifact-repo"
  description   = "Artifact registry repository for ${var.proj_name}"
  location      = var.location
  format        = "DOCKER"
  docker_config {
    immutable_tags = true
  }
}

resource "google_vpc_access_connector" "connector" {
  project        = var.proj_id
  name           = "cloudrun-connector"
  region         = var.location
  ip_cidr_range  = "192.168.16.0/28"
  network        = var.vpc_network_name
  min_throughput = 200
  max_throughput = 300
}


# react-portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_frontend" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-frontend"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/frontend-app:latest"
      command = ["npm", "start"]
      ports {
        container_port = 3000
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress = "ALL_TRAFFIC"
    }
    timeout = "120s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "frontend_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_frontend.name
  location = google_cloud_run_v2_service.run_frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# flutter-portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_flutter_portfolio" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-flutter-portfolio"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/flutter-portfolio:latest"
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress = "ALL_TRAFFIC"
    }
    timeout = "120s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "flutter_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_flutter_portfolio.name
  location = google_cloud_run_v2_service.run_flutter_portfolio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# vaultwarden ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_vault" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-vault"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "vaultwarden/server:latest"
      env {
        name  = "WEBSOCKET_ENABLED"
        value = "true"
      }
      env {
        name  = "SIGNUPS_ALLOWED"
        value = "false" # Disable if signup is needed          
      }
      ports {container_port = 80}
      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }
      volume_mounts {
        name       = "vaultwarden-data"
        mount_path = "/data"
      }
    }
    volumes {
      name = "vaultwarden-data"
      gcs {
        bucket    = var.vault_bucket_name
        read_only = false
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    timeout = "120s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}


resource "google_cloud_run_service_iam_member" "vault_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_vault.name
  location = google_cloud_run_v2_service.run_vault.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}



# Rstudio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_rstudio" {
  project  = var.proj_id
  name     = "${var.proj_name}-run-rstudio"
  location = var.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.location}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/rstudio-app:latest"
      # command = ["rstudio-server"]
      ports { container_port = 8787 }
      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }
    }
    scaling {
      max_instance_count = 1
      min_instance_count = 0
    }
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress = "ALL_TRAFFIC"
    }
    timeout = "600s"
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "rstudio_public_access" {
  project  = var.proj_id
  service  = google_cloud_run_v2_service.run_rstudio.name
  location = google_cloud_run_v2_service.run_rstudio.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}





# proxmox
# ntpd/chronyd
# Audiobookshelf
# Navidrome
# Mylar3
# gitlab
# Linkding: Self-hosted bookmark manager
# Prometheus: System monitoring and alerting toolkit
# Grafana: Data visualization and dashboarding tool, often used with Prometheus
# Cockpit: Web-based server management interface for Linux systems
# Filebrowser: Web-based file manager
# Fail2ban: Intrusion prevention software that monitors log files for malicious activity.
# OpenVAS: Comprehensive vulnerability scanner.
# Suricata/Snort (IDS/IPS): Intrusion Detection/Prevention Systems (can be resource-intensive).
# Minecraft Server: Host your own Minecraft multiplayer server  
# Game Server Emulators (e.g., for classic games): Explore emulators for various game servers.
# Plex Arcade/Game Server Hosting Tools: Some tools help integrate retro gaming with Plex or manage dedicated game servers.
# Jenkins/GitLab Runner: Automation servers for CI/CD pipelines
# Database Servers (PostgreSQL, MySQL, MariaDB, MongoDB): Run development or personal database instances.
# Redis/Memcached: In-memory data stores for caching and more.
# postgis/postgis: A powerful spatial database extender for PostgreSQL. Essential for storing, querying, and analyzing vector and raster geospatial data. You can combine this with a regular PostgreSQL image if needed.   
# geoserver/geoserver: An open-source server for sharing geospatial data. It implements open standards like WMS, WFS, WCS, and WPS. Great for visualizing and serving maps and spatial data.   
# mapserver/mapserver: Another robust open-source platform for publishing spatial data and creating interactive map applications.   
# osgeo/gdal: The Geospatial Data Abstraction Library. A translator library for raster and vector geospatial data formats. Useful for command-line data conversion and processing within a containerized environment.   
# osgeo/grass-gis: GRASS GIS (Geographic Resources Analysis Support System) is a powerful open-source GIS software suite with capabilities for raster, vector, image processing, and temporal data analysis.   
# qgis/qgis-server: Publishes QGIS projects as OGC Web Services (WMS). Allows you to serve maps created in the desktop QGIS application.   
# mapbox/tilemaker: A tool for generating vector tiles from various geospatial data sources, optimized for web mapping.
# maptiler/tileserver-gl: Serves vector tiles in the Mapbox GL JS format, enabling fast and interactive web maps.
# pgrouting/pgrouting: A PostgreSQL extension that adds routing functionality, allowing you to find shortest paths and perform network analysis on your spatial data.   
# arachnaworkflow/arachna: A workflow engine for geospatial processing, allowing you to chain together GDAL, GRASS, and other tools.
# Web Mapping & Visualization:

# leaflet/leaflet (as a base for custom apps): While Leaflet itself is a JavaScript library, you can containerize a web server (like Nginx or Apache) that serves your Leaflet-based web map applications.
# openlayers/openlayers (as a base for custom apps): Similar to Leaflet, OpenLayers is a powerful JavaScript library for displaying map data in web browsers. Containerize your application that uses it.   
# keplergl/kepler.gl (as a base for custom apps or pre-built demos): Kepler.gl is a powerful open-source geospatial visualization tool for large-scale datasets. You can containerize a web server hosting pre-configured Kepler.gl instances.   
# streamlit/streamlit (for geospatial dashboards): Streamlit is a Python library that makes it easy to create interactive web applications and dashboards. You can build compelling geospatial data visualizations with it and containerize the app.   
# plotly/dash (for interactive mapping): Dash is a Python framework for building analytical web applications. It has excellent support for interactive maps through libraries like plotly.express.   
# Geocoding & Reverse Geocoding:

# nominatim/nominatim: A powerful open-source geocoding service based on OpenStreetMap data. Running your own instance gives you control and privacy. (Note: Can be resource-intensive for large areas).   
# photon-geocoder/photon: Another fast, open-source geocoder built on top of Elasticsearch and OpenStreetMap data. Lighter than a full Nominatim instance.   
# pelias/api: A modular open-source geocoding and search service. You can choose the components you need.   
# Remote Sensing & Earth Observation:

# sentinelhub/eo-learn (as a base for processing scripts): EO-Learn is a Python library for large-scale Earth observation data processing with Sentinel Hub. You can create Docker containers with your EO-Learn scripts and necessary dependencies.   
# rasterio/rasterio (as a base for processing scripts): Rasterio is a Python library for reading and writing raster data. Containerize your Python scripts that use Rasterio for remote sensing analysis.   
# openeo/openeo-backend (for advanced EO processing): openEO is an API and framework for cloud-based Earth observation processing. Running a backend instance allows for complex analysis workflows.   
# GNSS & Tracking:

# traccar/traccar: An open-source GPS tracking server that supports a wide range of devices. You can host your own tracking platform for vehicles, assets, or even personal devices.   
# gpsd/gpsd: A service daemon that monitors one or more GPS or AIS receivers attached to a host computer through serial or USB ports, making the data available to be queried by client applications. Useful if you have physical GPS hardware connected to your server.   
# Fun & Experimental:

# blender/blender (for geospatial visualization): While not strictly a geospatial tool, Blender can be used for advanced 3D visualization of terrain and other geographic data. You can run Blender in a container for rendering tasks.   
# Containers hosting Jupyter Notebooks with geospatial libraries (e.g., jupyter/datascience-notebook with geopandas, rioxarray, etc. installed): Great for interactive exploration and analysis of geospatial data.


# apache/airflow:2.x: Platform to programmatically author, schedule, and monitor workflows.

# dbtlabs/dbt-core: Transformation workflow tool that lets teams quickly and collaboratively deploy analytics code.

# apache/hadoop:latest-jdk8: Apache Hadoop environment (can be resource-intensive for a full cluster). You might start with a single-node setup.
# apache/spark:latest: Apache Spark for big data processing (also resource-intensive). Again, a standalone setup is good for learning.
# Data Streaming:

# apache/kafka:latest: As mentioned before, essential for building real-time data pipelines.
# confluentinc/cp-kafka-connect:latest: Kafka Connect for scalable and reliable data streaming between Kafka and other systems.
# debezium/connect:latest: Change Data Capture (CDC) platform that streams database changes in real-time to Kafka.
# redpanda/redpanda:latest: Kafka-compatible streaming platform that aims for simplicity and performance.

# jupyter/datascience-notebook:latest: A full-fledged Jupyter Notebook environment with many popular data science libraries pre-installed (Pandas, NumPy, Matplotlib, Scikit-learn).
# jupyter/tensorflow-notebook:latest: Jupyter environment with TensorFlow.
# jupyter/pytorch-notebook:latest: Jupyter environment with PyTorch.
# jupyter/r-notebook:latest: Jupyter environment with R.
# These provide isolated and reproducible environments for data exploration, analysis, and model building.


# dosbox/dosbox: Run classic DOS games and applications in a container

# vncserver/vnc with an old operating system (e.g., Windows 98, BeOS): For the truly nostalgic, try running a VNC server with an image of a vintage operating system.

# grafana/grafana: For monitoring and visualization of your containerized applications and infrastructure.
# prometheus/prometheus: For monitoring and alerting, especially if you're running multiple containers.


# trueNAS

# ollama

