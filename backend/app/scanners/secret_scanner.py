import re


SECRET_PATTERNS = [
    (r"(?i)api[_-]?key\s*=\s*['\"][^'\"]+['\"]", "Hardcoded API key detected"),
    (r"(?i)secret\s*=\s*['\"][^'\"]+['\"]", "Hardcoded secret detected"),
    (r"(?i)password\s*=\s*['\"][^'\"]+['\"]", "Hardcoded password detected"),
    (r"(?i)token\s*=\s*['\"][^'\"]+['\"]", "Hardcoded token detected"),
]


def run_secret_scan(content: str, file_path: str | None = None) -> list[dict]:
    findings = []
    lines = content.splitlines()

    for idx, line in enumerate(lines, start=1):
        for pattern, title in SECRET_PATTERNS:
            if re.search(pattern, line):
                findings.append(
                    {
                        "tool": "secret-scanner",
                        "rule_id": "HARDCODED_SECRET",
                        "title": title,
                        "severity": "HIGH",
                        "description": f"Potential secret found in source code at line {idx}.",
                        "recommendation": "Remove hardcoded secrets and store them in environment variables or a secure secret manager.",
                        "file_path": file_path,
                        "line_number": idx,
                    }
                )
    return findings