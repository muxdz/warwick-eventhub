resource "aws_lb" "api" {
  name               = "eventhub-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

resource "aws_lb_target_group" "api" {
  name        = "eventhub-api-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"

  vpc_id = aws_vpc.eventhub.id

  health_check {
    enabled  = true
    protocol = "HTTP"
    path     = "/health"
    port     = "traffic-port"

    matcher = "200"

    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.api.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.api.arn

  port     = 443
  protocol = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-TLS13-1-2-Res-PQ-2025-09"
  certificate_arn = "arn:aws:acm:eu-west-2:442426880939:certificate/89b8dd39-aaef-42df-b44e-a979a00ed80b"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn

    forward {
      stickiness {
        duration = 3600
        enabled  = false
      }
      target_group {
        arn    = "arn:aws:elasticloadbalancing:eu-west-2:442426880939:targetgroup/eventhub-api-tg/ffd527056962f46e"
        weight = 1
      }
    }
  }
}