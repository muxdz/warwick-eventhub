terraform {
  backend "s3" {
    bucket = "eventhub-tfstate-442426880939-eu-west-2"
    key    = "eventhub/production/terraform.tfstate"
    region = "eu-west-2"

    encrypt      = true
    use_lockfile = true
  }
}