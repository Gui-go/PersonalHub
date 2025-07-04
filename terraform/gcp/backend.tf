terraform {
  backend "gcs" {
    bucket  = "personalhub14-tf-state-bucket"
    prefix  = "terraform/state"
    credentials = "personalhub14-terraform-sa-key.json"
  }
}