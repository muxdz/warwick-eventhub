resource "aws_db_subnet_group" "eventhub" {
  name = "eventhub-db-subnet-group"

  description = "Private subnets for EventHub RDS"

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}

resource "aws_db_instance" "eventhub" {
  identifier = "eventhub-db"

  allocated_storage = 20

  engine         = "postgres"
  engine_version = "18.3"
  instance_class = "db.t4g.micro"

  db_name  = "eventhub"
  username = "eventhub_admin"

  port = 5432

  storage_type      = "gp2"
  storage_encrypted = true

  db_subnet_group_name = aws_db_subnet_group.eventhub.name

  vpc_security_group_ids = [
    aws_security_group.db.id
  ]

  publicly_accessible = false
  multi_az            = false

  backup_retention_period    = 1
  auto_minor_version_upgrade = true
  deletion_protection        = false

  copy_tags_to_snapshot = true

  max_allocated_storage = 1000

  performance_insights_enabled = true

  skip_final_snapshot = true

  lifecycle {
    prevent_destroy = true
  }
}