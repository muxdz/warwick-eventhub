import pytest
from pydantic import ValidationError
from app.schemas.users import UserCreate

@pytest.mark.parametrize("password,reason", [
    ("Short!", "at least 10 characters"),
    ("lowercase!", "uppercase letter"),
    ("UPPERCASE!", "lowercase letter"),
    ("NoSymbols1", "one symbol"),
    ("Whitespace A", "one symbol"),
    ("", "at least 10 characters"),
])
def test_rejects_invalid_password(password, reason):
    with pytest.raises(ValidationError) as error:
        UserCreate(user_name="Alice", email="alice@example.com", password=password)
    assert reason in str(error.value)

@pytest.mark.parametrize("password", ["Abcdefghi!", "Abcdefghi_", "Abcdefghi£"])
def test_accepts_valid_password(password):
    assert UserCreate(user_name="Alice", email="alice@example.com", password=password).password == password
