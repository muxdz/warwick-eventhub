resource "aws_iam_role" "ecs_execution" {
  name        = "eventhub-ecs-execution-role"
  description = "Allows ECS tasks to call AWS services on your behalf."

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role = aws_iam_role.ecs_execution.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_ssm" {
  name = "EventHubParameterStoreAccess"
  role = aws_iam_role.ecs_execution.name

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ssm:GetParameters"
        ]

        Resource = [
          "arn:aws:ssm:eu-west-2:442426880939:parameter/eventhub/prod/db-password",
          "arn:aws:ssm:eu-west-2:442426880939:parameter/eventhub/prod/jwt-secret"
        ]
      }
    ]
  })
}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]
}

resource "aws_iam_role" "github_deploy" {
  name = "eventhub-github-deploy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }

        Action = "sts:AssumeRoleWithWebIdentity"

        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"

            "token.actions.githubusercontent.com:sub" = "repo:muxdz@77849065/warwick-eventhub@1330190702:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_deploy" {
  name = "EventHubGitHubDeployment"
  role = aws_iam_role.github_deploy.name

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "ECRLogin",
        "Effect" : "Allow",
        "Action" : "ecr:GetAuthorizationToken",
        "Resource" : "*"
      },
      {
        "Sid" : "PushEventHubImage",
        "Effect" : "Allow",
        "Action" : [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage"
        ],
        "Resource" : "arn:aws:ecr:eu-west-2:442426880939:repository/eventhub-backend"
      },
      {
        "Sid" : "ReadAndRegisterTaskDefinition",
        "Effect" : "Allow",
        "Action" : [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition"
        ],
        "Resource" : "*"
      },
      {
        "Sid" : "DeployEventHubService",
        "Effect" : "Allow",
        "Action" : [
          "ecs:UpdateService",
          "ecs:DescribeServices"
        ],
        "Resource" : "arn:aws:ecs:eu-west-2:442426880939:service/eventhub-cluster/eventhub-backend-service"
      },
      {
        "Sid" : "PassExecutionRole",
        "Effect" : "Allow",
        "Action" : "iam:PassRole",
        "Resource" : "arn:aws:iam::442426880939:role/eventhub-ecs-execution-role"
      },
      {
        "Sid" : "RunMigrationTask",
        "Effect" : "Allow",
        "Action" : [
          "ecs:RunTask",
          "ecs:DescribeTasks"
        ],
        "Resource" : "*"
      }
    ]
  })
}