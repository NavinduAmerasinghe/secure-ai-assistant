def normalize_severity(value: str | None) -> str:
    if not value:
        return "LOW"

    value = value.upper()

    mapping = {
        "ERROR": "HIGH",
        "WARNING": "MEDIUM",
        "INFO": "LOW",
        "LOW": "LOW",
        "MEDIUM": "MEDIUM",
        "HIGH": "HIGH",
        "CRITICAL": "CRITICAL",
    }

    return mapping.get(value, "LOW")