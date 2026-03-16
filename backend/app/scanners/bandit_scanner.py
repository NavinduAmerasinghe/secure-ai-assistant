import json
import subprocess
from pathlib import Path


def run_bandit(file_path: str) -> list[dict]:
    if Path(file_path).suffix.lower() != ".py":
        return []

    try:
        result = subprocess.run(
            [
                "bandit",
                "-f",
                "json",
                "-q",
                file_path,
            ],
            capture_output=True,
            text=True,
            timeout=60,
            check=False,
        )

        if result.returncode not in (0, 1):
            return []

        output = json.loads(result.stdout) if result.stdout else {}
        return output.get("results", [])
    except Exception:
        return []