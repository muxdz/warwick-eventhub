resource "aws_cloudwatch_log_group" "backend" {
  name = "/ecs/eventhub-backend"

  retention_in_days = 0
}

resource "aws_sns_topic" "alerts" {
  name = "eventhub-alerts"
}

resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name = "Database CPU"

  namespace   = "AWS/RDS"
  metric_name = "CPUUtilization"

  statistic = "Average"

  period              = 300
  evaluation_periods  = 1
  threshold           = 90.0
  comparison_operator = "GreaterThanThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    DatabaseClass = aws_db_instance.eventhub.instance_class
  }
}

resource "aws_cloudwatch_metric_alarm" "database_storage" {
  alarm_name = "Database Storage"

  namespace   = "AWS/RDS"
  metric_name = "FreeStorageSpace"

  statistic = "Average"

  period              = 60
  evaluation_periods  = 1
  threshold           = 2.0
  comparison_operator = "LessThanThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.eventhub.identifier
  }
}
resource "aws_cloudwatch_metric_alarm" "ecs_cpu" {
  alarm_name = "ECS CPU"

  namespace   = "AWS/ECS"
  metric_name = "CPUUtilization"

  statistic = "Average"

  period              = 300
  evaluation_periods  = 1
  threshold           = 80.0
  comparison_operator = "GreaterThanThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    ClusterName = aws_ecs_cluster.eventhub.name
    ServiceName = aws_ecs_service.backend.name
  }
}
resource "aws_cloudwatch_metric_alarm" "ecs_memory" {
  alarm_name = "ECS Memory"

  namespace   = "AWS/ECS"
  metric_name = "MemoryUtilization"

  statistic = "Average"

  period              = 300
  evaluation_periods  = 1
  threshold           = 80.0
  comparison_operator = "GreaterThanThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    ClusterName = aws_ecs_cluster.eventhub.name
    ServiceName = aws_ecs_service.backend.name
  }
}
resource "aws_cloudwatch_metric_alarm" "http_target_count" {
  alarm_name = "HTTP Target Count"

  namespace   = "AWS/ApplicationELB"
  metric_name = "HTTPCode_Target_4XX_Count"

  statistic = "Average"

  period              = 300
  evaluation_periods  = 1
  threshold           = 1.0
  comparison_operator = "GreaterThanOrEqualToThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    TargetGroup  = aws_lb_target_group.api.arn_suffix
    LoadBalancer = aws_lb.api.arn_suffix
  }
}
resource "aws_cloudwatch_metric_alarm" "host_count" {
  alarm_name = "Host Count"

  namespace   = "AWS/ApplicationELB"
  metric_name = "UnHealthyHostCount"

  statistic = "Average"

  period              = 300
  evaluation_periods  = 1
  threshold           = 1.0
  comparison_operator = "GreaterThanOrEqualToThreshold"

  datapoints_to_alarm = 1

  treat_missing_data = "missing"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    TargetGroup  = aws_lb_target_group.api.arn_suffix
    LoadBalancer = aws_lb.api.arn_suffix
  }
}