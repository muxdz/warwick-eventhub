from app.config import settings


if settings.db_name != "eventhub_test":
    raise RuntimeError(
        f"Tests must use eventhub_test, not {settings.db_name}"
    )