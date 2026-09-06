## Database migrations

Production database migrations are not executed automatically by API
container startup.

Deployment order:

1. Build and push the new backend image.
2. Run the backend image as a one-off ECS task with:
   alembic upgrade head
3. Confirm that the migration task exits successfully.
4. Update the ECS API service to the new image.
5. Verify application health/readiness.

If the migration task fails, do not deploy the new API revision.

## Production secrets

Production secrets must not be stored in the repository or Docker image.

The following values will be stored in AWS Secrets Manager:

- PostgreSQL database password
- JWT signing secret

ECS will inject these secrets into the backend task as environment variables.

FastAPI will continue to access them through the existing Settings configuration.

Flow:

AWS Secrets Manager
→ ECS task definition
→ environment variables
→ Pydantic Settings
→ FastAPI