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