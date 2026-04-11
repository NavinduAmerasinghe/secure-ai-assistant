import subprocess
import json
import os

def run_snyk_scan(target_path, snyk_token=None):
    """
    Runs Snyk CLI on the given target_path (directory or file).
    Returns a list of findings in normalized format.
    """
    env = os.environ.copy()
    if snyk_token:
        env["SNYK_TOKEN"] = snyk_token
    try:
        result = subprocess.run(
            ["snyk", "test", "--json", target_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            timeout=120,
            check=False,
            text=True
        )
        if result.returncode not in (0, 1):
            return []
        try:
            snyk_json = json.loads(result.stdout)
            findings = []
            for vuln in snyk_json.get("vulnerabilities", []):
                findings.append({
                    "tool": "snyk",
                    "rule_id": vuln.get("id"),
                    "title": vuln.get("title", "Snyk finding"),
                    "severity": vuln.get("severity", "medium"),
                    "description": vuln.get("description", "Potential vulnerability detected by Snyk."),
                    "recommendation": vuln.get("fixedIn", ["Update dependency or apply patch"])[0],
                    "file_path": vuln.get("from", [None])[-1],
                    "line_number": None,
                })
            return findings
        except Exception:
            return []
    except Exception:
        return []
