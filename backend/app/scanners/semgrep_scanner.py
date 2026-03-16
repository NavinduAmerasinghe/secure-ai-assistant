import json
import subprocess


def run_semgrep(file_path: str) -> list[dict]:
    try:
        result = subprocess.run(
            [
                "semgrep",
                "--config=auto",
                "--json",
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