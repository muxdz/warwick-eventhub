# Warwick EventHub

## Overview

Warwick EventHub is a full-stack event discovery and management platform designed for university students and societies to search for and post events.

The app allows students to browse and discover new events, browse different societies and bookmark events. They are able to create their own accounts, create their own socieities. Society organisers are able to create and manage their own events as theyu wish.

It was built as an end-to-end production-style application, progressing from a local development and testing using containers in Docker, database migrations using Alembic, CI/CD and cloud deployed using AWS.

The main goal was to learn about the different technologies that goes into creating a website and how the web actually works. I have learnt how a modern application can go from source code to a secure and maintable deployment on AWS.

---

## Features

### Events

- Browse upcoming events
- View individual event details
- Search events
- Filter events by society
- Filter events by date
- Create events
- Edit existing events
- Delete events
- Handle non-existent events using dedicated 404 behaviour

### Societies

- Browse societies
- View individual society information
- Associate events with societies

### Authentication

- User registration
- User login using JWT authentication
- Password hashing and verification
- Protected API endpoints
- Authenticated user profile
- Login/logout state maintained by the frontend

### Bookmarks

- Bookmark events
- Remove bookmarks
- View bookmarked events on a dedicated page
- Reuse the same event components across event listings and bookmark views

---

## Architecture

Warwick EventHub uses a separated frontend using Next.js, backend using FastAPI and database architecture with PostgreSQL.

```text
User
  |
  v
Next.js Frontend
AWS Amplify
  |
  | HTTPS
  v
api.eventhub.muadz.uk
  |
  v
Application Load Balancer
  |
  v
ECS / AWS Fargate
FastAPI Backend
  |
  v
Amazon RDS
PostgreSQL
```

The frontend and backend are deployed independently.

This separation was intentional. The Next.js application is responsible for presentation and client interaction, while FastAPI exposes a REST API responsible for authentication, validation and application logic.

The backend does not expose the PostgreSQL database directly. All database access passes through the API, keeping database credentials and internal infrastructure inaccessible to browser clients.

The architecture also allows the frontend and backend to be deployed, scaled and changed independently.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Next.js App Router
- Vitest
- Playwright

### Backend

- Python
- FastAPI
- Psycopg
- Pydantic
- PyJWT
- Passlib/password hashing
- Pytest

### Database

- PostgreSQL
- Alembic

### DevOps / Cloud

- Docker
- Docker Compose
- AWS
- Terraform
- GitHub Actions
- GitHub OIDC
- Cloudflare DNS

### AWS

- Amazon ECS
- AWS Fargate
- Amazon ECR
- Amazon RDS for PostgreSQL
- Application Load Balancer
- AWS Amplify
- AWS Certificate Manager
- Amazon VPC
- CloudWatch
- S3 for Terraform state

---

## Local Development

The local environment mirrors the production architecture as closely as practical.

Docker is used so that the API and PostgreSQL database run in reproducible environments rather than relying on developer-specific machine configuration.

### Clone the repository

```bash
git clone https://github.com/muxdz/warwick-eventhub.git
cd warwick-eventhub
```

### Configure environment variables

Create the required environment files from the provided examples.

Environment variables are used for configuration such as:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DATABASE_HOST
DATABASE_PORT
JWT_SECRET_KEY
JWT_ALGORITHM
JWT_EXPIRE_MINUTES
CORS_ORIGIN
```

Secrets are deliberately excluded from source control.

### Start the backend environment

```bash
docker compose up --build
```

Docker Compose provides service discovery between containers, allowing the API to connect to PostgreSQL using the database service name instead of `localhost`.

### Run database migrations

```bash
alembic upgrade head
```

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend can then communicate with the FastAPI backend using the configured API URL.

---

## Testing

Testing is split across multiple layers rather than relying exclusively on manual browser testing.

### Backend

Pytest is used to test FastAPI behaviour including:

- Health endpoint
- Event listing
- Individual event retrieval
- 404 behaviour
- Event creation
- Partial updates
- Event deletion
- Authentication behaviour

```bash
pytest
```

Backend tests use a separate PostgreSQL test database so that tests do not modify development or production data.

### Frontend

Vitest is used for frontend unit and component testing.

```bash
npm run test
```

### End-to-End

Playwright tests the application from the user's perspective.

```bash
npx playwright test
```

Using separate backend, frontend and end-to-end test layers gives different types of failures a clear boundary.

A repository or API bug can therefore be distinguished from a frontend component problem or a full application integration failure.

---

## AWS Infrastructure

The production application is deployed in the AWS London region (`eu-west-2`).

The infrastructure was designed around managed services where possible rather than deploying the entire application onto a manually administered virtual machine.

### Frontend — AWS Amplify

The Next.js frontend is hosted using AWS Amplify.

Amplify was chosen because the frontend is primarily a web application and does not require the same container infrastructure as the backend.

Using Amplify provides:

- Managed frontend builds
- Deployment from source control
- HTTPS support
- Custom domain integration
- Reduced server administration

This avoids running a separate EC2 instance or container purely to serve the frontend.

### Backend — ECS and Fargate

The FastAPI application is packaged as a Docker image and runs as an ECS service using AWS Fargate.

Fargate was chosen instead of EC2 because the project requires container orchestration without requiring management of the underlying servers.

The deployment flow is:

```text
FastAPI source
      |
      v
Docker image
      |
      v
Amazon ECR
      |
      v
ECS Task Definition
      |
      v
AWS Fargate
```

ECS determines what container should run, while Fargate provides the compute resources required to run it.

This makes the application's runtime environment reproducible because the same Docker image tested during development is the unit deployed to production.

### Container Registry — Amazon ECR

Backend Docker images are stored in Amazon Elastic Container Registry.

ECR was chosen because it integrates directly with ECS and IAM.

Rather than copying application code onto production servers, deployments publish a versioned container image and instruct ECS to run the new image.

This produces a clearer and more repeatable deployment process.

### Database — Amazon RDS

PostgreSQL is hosted using Amazon RDS instead of running PostgreSQL inside the ECS application environment.

This separation was intentional.

Containers are disposable and can be replaced during deployment or recovery. Database state should therefore not depend on the lifecycle of an application container.

RDS provides a persistent managed database independently of the ECS tasks and also reduces the operational work associated with running PostgreSQL manually.

Application connections require SSL.

### Application Load Balancer

Clients do not connect directly to individual ECS tasks.

Requests instead pass through an Application Load Balancer:

```text
Internet
   |
   v
Application Load Balancer
   |
   v
ECS Target Group
   |
   v
Healthy FastAPI Task
```

The load balancer provides a stable entry point even when ECS replaces tasks and their internal network addresses change.

The target group performs health checks against:

```text
/health
```

Only healthy ECS tasks should receive application traffic.

---

## Networking & Security

The AWS deployment runs inside a dedicated VPC.

The network contains separate public and private areas rather than exposing every service directly to the internet.

### Public-facing components

The Application Load Balancer accepts HTTPS traffic from users.

An Internet Gateway and public subnet routing allow the load balancer to communicate with the internet.

### Private application resources

The database is not intended to be publicly accessed by application users.

Security groups restrict traffic based on which service requires access rather than simply opening ports globally.

For example:

```text
Internet
   |
 HTTPS :443
   |
   v
ALB Security Group
   |
 Backend application port
   |
   v
ECS Security Group
   |
 PostgreSQL :5432
   |
   v
RDS Security Group
```

The RDS security group accepts PostgreSQL traffic from the application infrastructure rather than exposing port `5432` to the general internet.

This applies the principle of least privilege: each component receives only the network access required for its role.

### HTTPS

Custom domains are used for both parts of the application:

```text
eventhub.muadz.uk
api.eventhub.muadz.uk
```

AWS Certificate Manager provides TLS certificates while DNS records are managed through Cloudflare.

HTTPS ensures credentials, JWTs and other API traffic are encrypted in transit.

---

## CI/CD

GitHub Actions automates testing and backend deployment.

The backend deployment pipeline follows roughly:

```text
Push to main
    |
    v
GitHub Actions
    |
    +--> Run tests
    |
    +--> Authenticate to AWS
    |
    +--> Build Docker image
    |
    +--> Push image to ECR
    |
    +--> Run database migrations
    |
    +--> Update ECS deployment
```

### GitHub OIDC

The pipeline uses GitHub's OpenID Connect integration with AWS rather than storing permanent AWS access keys as GitHub secrets.

GitHub Actions requests a short-lived identity token and uses it to assume an AWS IAM role.

```text
GitHub Actions
      |
      | OIDC token
      v
AWS IAM
      |
      | temporary credentials
      v
AWS resources
```

This was chosen because long-lived AWS access keys create unnecessary credential-management risk.

The IAM trust policy restricts role assumption to the expected GitHub repository and branch.

The deployment workflow therefore receives AWS permissions only while the workflow is running.

---

## Database Migrations

Database schema changes are managed using Alembic.

Originally, the database could be initialised using SQL schema files. That works for a completely new database but does not solve the problem of safely changing a database that already contains data.

Alembic introduces versioned migrations.

```text
Application version 1
        |
        v
Migration 001
        |
        v
Migration 002
        |
        v
Migration 003
        |
        v
Current database
```

A deployment can apply outstanding migrations using:

```bash
alembic upgrade head
```

Database migration logic is kept separate from the application's normal database-access layer.

The FastAPI application uses Psycopg and SQL for its repositories while Alembic is responsible specifically for schema evolution.

This avoids rewriting the application around an ORM purely to gain migration support.

---

## Infrastructure as Code

Terraform is used to represent AWS infrastructure as code.

Resources include infrastructure such as:

- VPC
- Subnets
- Internet Gateway
- Route tables
- Security groups
- ECR
- RDS
- ECS
- Application Load Balancer
- Target groups

Some AWS infrastructure was initially created while learning the services manually.

Rather than deleting working production infrastructure and recreating it, those resources were imported into Terraform.

This was an important design decision because Infrastructure as Code should describe the real infrastructure without unnecessarily destroying working resources.

The workflow was therefore:

```text
Existing AWS resource
        |
        v
Write Terraform configuration
        |
        v
terraform import
        |
        v
terraform plan
        |
        v
No unexpected infrastructure changes
```

The desired result after importing infrastructure is:

```text
No changes.
```

This demonstrates that Terraform's configuration and the real AWS environment agree before Terraform is trusted to make future modifications.

### Remote State

Terraform state is stored remotely in Amazon S3 rather than relying only on a local state file.

The state bucket uses features such as versioning and encryption.

Remote state reduces the risk of losing the authoritative infrastructure state when moving between development machines and provides a foundation for collaborative infrastructure management.

---

## Monitoring & Cost Management

CloudWatch is used to inspect logs produced by the ECS application.

Container logs proved particularly useful during deployment because failures inside ECS tasks cannot always be diagnosed from the ECS service status alone.

For example, application startup, database connectivity and migration failures can be inspected through CloudWatch rather than requiring direct access to a production server.

The deployment was also designed with AWS cost visibility in mind.

AWS Cost Explorer can be used to monitor services including:

- ECS / Fargate
- RDS
- Application Load Balancer
- Amplify
- ECR
- CloudWatch
- Data transfer

ECR lifecycle management can also be used to prevent old container images from accumulating indefinitely.

Cost monitoring is treated as part of operating the application rather than something considered only after deployment.

---

## Engineering Decisions

### FastAPI with a repository layer

Database access is separated from HTTP route handling.

Rather than embedding SQL directly throughout API endpoints, database operations are contained within repository functions.

This keeps HTTP concerns, validation and database behaviour more clearly separated.

### Psycopg instead of introducing a full ORM

The application uses PostgreSQL through Psycopg and SQL rather than replacing the data layer with SQLAlchemy ORM.

This keeps database behaviour explicit and provides direct experience working with SQL.

SQLAlchemy is only used where required by the migration tooling.

### JWT authentication

The API uses JWT access tokens so that authentication remains stateless from the API's perspective.

Protected endpoints resolve the authenticated user from the supplied token rather than relying on application-server memory.

### Docker for environment consistency

The backend is containerised so development, CI and AWS all execute the application in a predictable environment.

This reduces the difference between "works on my machine" and the environment that actually runs the application.

### Managed database instead of containerised production PostgreSQL

PostgreSQL runs in Docker locally but uses RDS in production.

Docker is useful for creating disposable development databases.

Production data, however, requires a lifecycle independent of application containers, making RDS the more appropriate boundary.

### ECS/Fargate instead of EC2

Running containers directly on EC2 would require management of operating systems, patching, capacity and container hosts.

Fargate allows the project to focus on the application and container configuration while AWS manages the underlying compute hosts.

### Application Load Balancer instead of exposing tasks directly

ECS tasks can be replaced at any time.

The ALB provides clients with a stable endpoint while dynamically routing requests to whichever healthy tasks are currently registered.

### OIDC instead of permanent deployment credentials

CI/CD does not contain permanent AWS IAM access keys.

GitHub Actions assumes a restricted AWS role through OIDC and receives temporary credentials.

This reduces the impact of leaked CI configuration and follows modern cloud credential-management practices.

### Separate test layers

Pytest, Vitest and Playwright solve different problems.

Using all three avoids making end-to-end tests responsible for detecting every type of bug and allows failures to be identified closer to the layer where they originate.

### Infrastructure imported into Terraform

The AWS infrastructure was first built manually as part of learning how each service works.

After understanding the architecture, Terraform was introduced to make that infrastructure reproducible.

Importing existing resources rather than immediately recreating them provided experience with both manual cloud administration and Infrastructure as Code while protecting the working deployment.

---

## Future Improvements

Although the application is fully deployable, several changes could extend it further:

- Add refresh-token based authentication
- Move authentication towards secure HTTP-only cookies
- Add role-based permissions for society administrators
- Add event image uploads using Amazon S3
- Add email verification and password reset flows
- Add event pagination
- Add improved full-text search
- Add caching for frequently accessed data
- Introduce ECS autoscaling
- Add CloudWatch dashboards and alarms
- Add distributed tracing and more structured application metrics
- Add automated dependency and container vulnerability scanning
- Expand Terraform coverage and reusable Terraform modules
- Add deployment environments such as staging and production
- Add automated database backups and recovery testing
- Add blue/green or canary deployments
- Add rate limiting to authentication and public API endpoints
- Improve accessibility and responsive design
- Add richer society administration functionality