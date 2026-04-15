# Helper for local deterministic explanations for vulnerabilities
import re
from typing import Dict, Any

def generate_local_explanation(finding: Dict[str, Any]) -> Dict[str, str]:
    """
    Generate a deterministic, issue-specific explanation for a vulnerability finding.
    Returns a dict with structured fields.
    """
    title = (finding.get("title") or "").lower()
    description = (finding.get("description") or "").lower()
    rule = (finding.get("rule_id") or "").lower()
    recommendation = (finding.get("recommendation") or "").lower()
    tool = (finding.get("tool") or "").lower()
    file_path = finding.get("file_path")
    line_number = finding.get("line_number")
    severity = finding.get("severity") or "UNKNOWN"

    def location():
        if file_path and line_number:
            return f"File: {file_path}, Line: {line_number}"
        elif file_path:
            return f"File: {file_path}"
        return "(location unknown)"

    # SQL Injection
    if (
        "sql injection" in title or "sql injection" in description or
        rule in {"b608", "b609", "cwe-89"} or
        "sql" in recommendation and "injection" in recommendation
    ):
        return {
            "summary": f"SQL Injection vulnerability detected at {location()}.",
            "issue_type": "SQL Injection",
            "risk": "Allows attackers to execute arbitrary SQL queries against the database.",
            "why_it_matters": "SQL injection can lead to data theft, data loss, or full system compromise.",
            "likely_attack_scenario": "An attacker crafts input to modify the intended SQL query, bypassing authentication or extracting sensitive data.",
            "likely_fix": "Use parameterized queries or ORM methods. Never concatenate user input into SQL statements.",
            "secure_coding_note": "Always validate and sanitize user input. Prefer safe database APIs that prevent injection."
        }

    # Hardcoded Secret / Credential
    if (
        "hardcoded password" in title or "hardcoded secret" in title or
        "credential" in title or "secret" in title or
        "hardcoded" in description or "secret" in description or "credential" in description or
        "secret" in rule or "credential" in rule
    ):
        return {
            "summary": f"Hardcoded secret or credential found at {location()}.",
            "issue_type": "Secret Exposure",
            "risk": "Secrets in code can be easily extracted and abused by attackers.",
            "why_it_matters": "Exposed credentials may allow unauthorized access to sensitive systems or data.",
            "likely_attack_scenario": "An attacker finds a password or API key in the codebase and uses it to access protected resources.",
            "likely_fix": "Remove secrets from code. Use environment variables or secret management tools.",
            "secure_coding_note": "Never store secrets in source code. Rotate any exposed credentials immediately."
        }

    # Command Injection
    if (
        "command injection" in title or "command injection" in description or
        "subprocess" in description or "os.system" in description or
        "popen" in description or "shell=true" in description or
        "command injection" in recommendation or
        rule in {"b602", "cwe-78"}
    ):
        return {
            "summary": f"Command Injection risk at {location()}.",
            "issue_type": "Command Injection",
            "risk": "Allows attackers to execute arbitrary system commands on the server.",
            "why_it_matters": "Command injection can lead to full system compromise.",
            "likely_attack_scenario": "User input is passed to a shell command, allowing an attacker to run malicious commands.",
            "likely_fix": "Avoid shell=True. Use safe APIs and validate input strictly.",
            "secure_coding_note": "Never pass unsanitized input to system commands. Prefer high-level APIs."
        }

    # Unsafe eval/exec/code execution
    if (
        "eval" in title or "exec" in title or
        "eval" in description or "exec" in description or
        "code execution" in title or "code execution" in description or
        rule in {"b307", "cwe-94"}
    ):
        return {
            "summary": f"Unsafe code execution detected at {location()}.",
            "issue_type": "Unsafe Code Execution",
            "risk": "Allows attackers to execute arbitrary code, leading to full compromise.",
            "why_it_matters": "Dynamic code execution is extremely dangerous if user input is involved.",
            "likely_attack_scenario": "Attacker supplies input that is executed as code, gaining control of the application.",
            "likely_fix": "Never use eval/exec on untrusted input. Refactor to avoid dynamic execution.",
            "secure_coding_note": "Avoid eval/exec. Use safe alternatives and strict input validation."
        }

    # Cross-Site Scripting (XSS)
    if (
        "xss" in title or "cross-site scripting" in title or
        "xss" in description or "cross-site scripting" in description or
        rule in {"cwe-79"}
    ):
        return {
            "summary": f"Cross-Site Scripting (XSS) vulnerability at {location()}.",
            "issue_type": "Cross-Site Scripting (XSS)",
            "risk": "Allows attackers to inject malicious scripts into web pages viewed by users.",
            "why_it_matters": "XSS can steal user data, hijack sessions, or deface websites.",
            "likely_attack_scenario": "Attacker injects a script that runs in the victim's browser, stealing cookies or credentials.",
            "likely_fix": "Escape output, use proper content security policies, and validate input.",
            "secure_coding_note": "Always encode output and use frameworks with built-in XSS protection."
        }

    # Weak Cryptography
    if (
        "weak crypto" in title or "weak cryptography" in title or
        "md5" in description or "sha1" in description or
        "insecure cipher" in description or
        rule in {"cwe-327"}
    ):
        return {
            "summary": f"Weak cryptography detected at {location()}.",
            "issue_type": "Weak Cryptography",
            "risk": "Weak algorithms can be broken, exposing sensitive data.",
            "why_it_matters": "Attackers can decrypt or forge data if weak cryptography is used.",
            "likely_attack_scenario": "Sensitive data is encrypted with a weak cipher and is easily cracked.",
            "likely_fix": "Use strong, modern cryptographic algorithms (e.g., AES, SHA-256).",
            "secure_coding_note": "Avoid deprecated algorithms like MD5/SHA1. Use vetted libraries."
        }

    # Insecure Deserialization
    if (
        "deserialization" in title or "deserialization" in description or
        "pickle" in description or "marshal" in description or
        rule in {"cwe-502"}
    ):
        return {
            "summary": f"Insecure deserialization at {location()}.",
            "issue_type": "Insecure Deserialization",
            "risk": "May allow attackers to execute arbitrary code or escalate privileges.",
            "why_it_matters": "Untrusted data deserialization can lead to code execution or data tampering.",
            "likely_attack_scenario": "Attacker sends crafted serialized data that triggers code execution when deserialized.",
            "likely_fix": "Avoid deserializing untrusted data. Use safe formats like JSON.",
            "secure_coding_note": "Never use pickle/marshal on untrusted input. Prefer safe serialization."
        }

    # Missing Validation / Unsafe Input Handling
    if (
        "validation" in title or "input validation" in title or
        "unsafe input" in title or "input not validated" in description or
        "missing validation" in description or
        rule in {"cwe-20"}
    ):
        return {
            "summary": f"Missing or unsafe input validation at {location()}.",
            "issue_type": "Input Validation",
            "risk": "Unvalidated input can lead to injection, XSS, or logic bugs.",
            "why_it_matters": "Input validation is a primary defense against many attacks.",
            "likely_attack_scenario": "Attacker supplies unexpected input, causing security flaws or crashes.",
            "likely_fix": "Validate and sanitize all user input. Use allow-lists and strict types.",
            "secure_coding_note": "Always validate input at every trust boundary."
        }

    # Fallback
    return {
        "summary": f"Potential security issue detected at {location()}.",
        "issue_type": "Unknown or Unclassified",
        "risk": "This issue may pose a security risk.",
        "why_it_matters": "Review the finding details to assess the impact.",
        "likely_attack_scenario": "An attacker may exploit this issue if left unaddressed.",
        "likely_fix": "Review and address according to secure coding best practices.",
        "secure_coding_note": "Consult security guidelines for this type of issue."
    }
