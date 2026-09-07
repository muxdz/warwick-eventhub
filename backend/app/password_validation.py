"""Shared password policy for registration and password changes."""

import re
import unicodedata


def validate_password(value: str) -> str:
    """Return the password unchanged, or raise ValueError listing unmet rules."""
    errors = []
    if len(value) < 10:
        errors.append("at least 10 characters")
    if not re.search(r"[A-Z]", value):
        errors.append("at least one uppercase letter (A-Z)")
    if not re.search(r"[a-z]", value):
        errors.append("at least one lowercase letter (a-z)")
    if not any(unicodedata.category(char)[0] in "PS" for char in value):
        errors.append("at least one symbol (e.g. !, @, #)")
    if errors:
        raise ValueError("Password must contain " + "; ".join(errors) + ".")
    return value
