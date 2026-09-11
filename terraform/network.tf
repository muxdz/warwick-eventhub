# __generated__ by Terraform
# Please review these resources and move them into your main configuration files.

# __generated__ by Terraform
resource "aws_vpc" "eventhub" {
  assign_generated_ipv6_cidr_block     = false
  cidr_block                           = "10.0.0.0/16"
  enable_dns_hostnames                 = false
  enable_dns_support                   = true
  enable_network_address_usage_metrics = false
  instance_tenancy                     = "default"
  ipv4_ipam_pool_id                    = null
  ipv4_netmask_length                  = null
  region                               = "eu-west-2"
  tags = {
    Name = "eventhub-vpc"
  }
  tags_all = {
    Name = "eventhub-vpc"
  }
}

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.eventhub.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "eventhub-public-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id            = aws_vpc.eventhub.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "eventhub-public-b"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.eventhub.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "eventhub-private-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.eventhub.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "eventhub-private-b"
  }
}

resource "aws_internet_gateway" "eventhub" {
  vpc_id = aws_vpc.eventhub.id

  tags = {
    Name = "eventhub-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.eventhub.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.eventhub.id
  }

  tags = {
    Name = "eventhub-public-rt"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "alb" {
  name        = "eventhub-alb-sg"
  description = "Security group for EventHub load balancer"
  vpc_id      = aws_vpc.eventhub.id

}

resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80

}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 443
  to_port     = 443

}

resource "aws_vpc_security_group_ingress_rule" "api_from_alb" {
  security_group_id = aws_security_group.api.id

  referenced_security_group_id = aws_security_group.alb.id

  ip_protocol = "tcp"
  from_port   = 8000
  to_port     = 8000

}

resource "aws_security_group" "api" {
  name        = "eventhub-api-sg"
  description = "Security group for EventHub FastAPI service"
  vpc_id      = aws_vpc.eventhub.id

}

resource "aws_security_group" "db" {
  name        = "eventhub-db-sg"
  description = "Security group for EventHub PostgreSQL database"
  vpc_id      = aws_vpc.eventhub.id

}

resource "aws_vpc_security_group_ingress_rule" "db_from_api" {
  security_group_id = aws_security_group.db.id

  referenced_security_group_id = aws_security_group.api.id

  ip_protocol = "tcp"
  from_port   = 5432
  to_port     = 5432

}

resource "aws_vpc_security_group_egress_rule" "alb_all" {
  security_group_id = aws_security_group.alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

}

resource "aws_vpc_security_group_egress_rule" "api_all" {
  security_group_id = aws_security_group.api.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

}

resource "aws_vpc_security_group_egress_rule" "db_all" {
  security_group_id = aws_security_group.db.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"

}