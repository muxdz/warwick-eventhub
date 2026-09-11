resource "aws_ecs_cluster" "eventhub" {
  name = "eventhub-cluster"

  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }
}

resource "aws_ecs_service" "backend" {
  name    = "eventhub-backend-service"
  cluster = aws_ecs_cluster.eventhub.id

  task_definition = "arn:aws:ecs:eu-west-2:442426880939:task-definition/eventhub-backend:7"

  desired_count = 1

  launch_type = "FARGATE"

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]

    security_groups = [
      aws_security_group.api.id
    ]

    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "eventhub-backend"
    container_port   = 8000
  }

  enable_ecs_managed_tags = true

  wait_for_steady_state = false

  lifecycle {
    ignore_changes = [
      task_definition
    ]
  }
}