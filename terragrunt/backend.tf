terraform {
  backend "gcs" {
    bucket = "personalhub15gcs4state"
    prefix = "terragrunt/."
  }
}
