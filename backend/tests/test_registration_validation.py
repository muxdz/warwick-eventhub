import pytest
from pydantic import ValidationError
from app.schemas.users import UserCreate, PasswordUpdate


@pytest.fixture(autouse=True)
def reset_db():
    """Schema validation does not need a database."""
    yield


@pytest.mark.parametrize("schema", [
    lambda password: UserCreate(user_name="Alice", email="alice@example.com", password=password),
    lambda password: PasswordUpdate(old_password="legacy", new_password=password),
])

@pytest.mark.parametrize("password,reason", [
    ("Short!", "at least 10 characters"),
    ("lowercase!", "uppercase letter"),
    ("UPPERCASE!", "lowercase letter"),
    ("NoSymbols1", "one symbol"),
    ("Whitespace A", "one symbol"),
    ("", "at least 10 characters"),
])
def test_rejects_invalid_password(schema, password, reason):
    with pytest.raises(ValidationError) as error:
        schema(password)
    assert reason in str(error.value)

@pytest.mark.parametrize("password", ["Abcdefghi!", "Abcdefghi_", "Abcdefghi£"])
def test_accepts_valid_password(password):
    assert UserCreate(user_name="Alice", email="alice@example.com", password=password).password == password
    update = PasswordUpdate(old_password="legacy", new_password=password)
    assert update.new_password == password
    assert update.old_password == "legacy"
