

# Data Stores:

resource "google_discovery_engine_data_store" "ds_virtualguigo" {
    project = var.proj_id
    location = "global"
    data_store_id = "ds-virtualguigo-${var.proj_id}"
    display_name = "Virtual Guigo Data Store"
    industry_vertical = "GENERIC"
    content_config = "CONTENT_REQUIRED"
    solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
    create_advanced_site_search = false
    # lifecycle {
    #     prevent_destroy = true
    # }
}

# resource "google_discovery_engine_data_store" "ds_ms" {
#     project = var.proj_id
#     location = "global"
#     data_store_id = "ds-ms-${var.proj_id}"
#     display_name = "MS References Data Store"
#     industry_vertical = "GENERIC"
#     content_config = "CONTENT_REQUIRED"
#     solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
#     create_advanced_site_search = false
#     # lifecycle {
#     #     prevent_destroy = true
#     # }
# }

# resource "google_discovery_engine_data_store" "ds_gwr" {
#     project = var.proj_id
#     location = "global"
#     data_store_id = "ds-gwr-${var.proj_id}"
#     display_name = "GWR References Data Store"
#     industry_vertical = "GENERIC"
#     content_config = "CONTENT_REQUIRED"
#     solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
#     create_advanced_site_search = false
#     # lifecycle {
#     #     prevent_destroy = true
#     # }
# }



# Search Engines:

resource "google_discovery_engine_search_engine" "virtualguigo_searchengine" {
    depends_on = [google_discovery_engine_data_store.ds_virtualguigo]
    project = var.proj_id
    engine_id = "virtualguigo-se-${var.proj_id}"
    display_name = "virtualguigo Search Engine"
    collection_id = "default_collection"
    location = google_discovery_engine_data_store.ds_virtualguigo.location
    industry_vertical = "GENERIC"
    data_store_ids = [google_discovery_engine_data_store.ds_virtualguigo.data_store_id]
    common_config {
        company_name = "Guigo"
    }
    search_engine_config {
        search_add_ons = ["SEARCH_ADD_ON_LLM"]
    }
}


# resource "google_discovery_engine_search_engine" "ms_searchengine" {
#     depends_on = [google_discovery_engine_data_store.ds_ms]
#     project = var.proj_id
#     engine_id = "ms-se"
#     display_name = "MS Search Engine"
#     collection_id = "default_collection"
#     location = google_discovery_engine_data_store.ds_ms.location
#     industry_vertical = "GENERIC"
#     data_store_ids = [google_discovery_engine_data_store.ds_ms.data_store_id]
#     common_config {
#         company_name = "Guigo"
#     }
#     search_engine_config {
#         search_add_ons = ["SEARCH_ADD_ON_LLM"]
#     }
# }

# resource "google_discovery_engine_search_engine" "gwr_searchengine" {
#     depends_on = [google_discovery_engine_data_store.ds_gwr]
#     project = var.proj_id
#     engine_id = "gwr-se"
#     display_name = "GWR Search Engine"
#     collection_id = "default_collection"
#     location = google_discovery_engine_data_store.ds_gwr.location
#     industry_vertical = "GENERIC"
#     data_store_ids = [google_discovery_engine_data_store.ds_gwr.data_store_id]
#     common_config {
#         company_name = "Guigo"
#     }
#     search_engine_config {
#         search_add_ons = ["SEARCH_ADD_ON_LLM"]
#     }
# }

