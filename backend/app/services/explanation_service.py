from sqlalchemy.orm import Session
# LangChain disabled: from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.models.explanation import Explanation
from app.models.vulnerability import Vulnerability
# LangChain disabled: imports removed


def get_vulnerability_by_id(db: Session, vulnerability_id: int) -> Vulnerability | None:
    return db.query(Vulnerability).filter(Vulnerability.id == vulnerability_id).first()


def get_explanation_by_vulnerability(db: Session, vulnerability_id: int, user_id: int) -> Explanation | None:
    return (
        db.query(Explanation)
        .filter(
            Explanation.vulnerability_id == vulnerability_id,
            Explanation.user_id == user_id,
        )
        .first()
    )


def create_explanation_for_vulnerability(db: Session, vulnerability: Vulnerability) -> Explanation:
    # LangChain disabled: Use realistic, context-aware explanation
    retrieved_context = None

    title_lower = (vulnerability.title or '').lower()
    description = vulnerability.description or 'No description provided.'
    recommendation = vulnerability.recommendation or 'Follow secure coding best practices and refer to official documentation for remediation steps.'

    if 'sql injection' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
SQL Injection is a critical vulnerability that occurs when user input is improperly handled in SQL queries.

Attack scenario:
An attacker submits crafted input (e.g., ' OR 1=1 --) in a login form.

Why it is risky:
Attackers can exfiltrate entire databases.

How to fix it securely:
- Use parameterized queries
- Avoid dynamic SQL
- Apply least privilege

Safer coding recommendation:
Use ORM safely and validate inputs.
""".strip()

    elif 'xss' in title_lower or 'cross-site scripting' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
XSS allows execution of malicious JavaScript in browsers.

Attack scenario:
<script>malicious()</script> injection.

Why it is risky:
Session hijacking and data theft.

How to fix it securely:
- Escape output
- Use CSP
- Validate input

Safer coding recommendation:
Avoid innerHTML usage.
""".strip()

    elif 'hardcoded secret' in title_lower or 'secret' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
Secrets stored in code can be exposed.

Attack scenario:
API keys leaked via GitHub.

Why it is risky:
Unauthorized access and breaches.

How to fix it securely:
- Use environment variables
- Use secret managers

Safer coding recommendation:
Rotate and scan secrets regularly.
""".strip()

    elif 'command injection' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
Command Injection allows execution of OS commands.

Attack scenario:
Input like ; rm -rf /

Why it is risky:
Full system compromise.

How to fix it securely:
- Avoid shell execution
- Validate inputs

Safer coding recommendation:
Use safe APIs like subprocess without shell.
""".strip()

    elif 'deserialization' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
Unsafe deserialization allows code execution.

Attack scenario:
Malicious object triggers execution.

Why it is risky:
Remote code execution.

How to fix it securely:
- Avoid untrusted data
- Use safe formats like JSON

Safer coding recommendation:
Validate all serialized inputs.
""".strip()

    elif 'directory traversal' in title_lower or 'path traversal' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
Path traversal accesses unauthorized files.

Attack scenario:
/../../etc/passwd

Why it is risky:
Sensitive file exposure.

How to fix it securely:
- Validate paths
- Restrict directories

Safer coding recommendation:
Never trust file inputs.
""".strip()

    elif 'csrf' in title_lower or 'cross-site request forgery' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
CSRF tricks users into unwanted actions.

Attack scenario:
Clicking malicious links.

Why it is risky:
Unauthorized actions.

How to fix it securely:
- Use CSRF tokens
- Same-site cookies

Safer coding recommendation:
Verify all requests.
""".strip()

    elif 'idor' in title_lower or 'insecure direct object reference' in title_lower:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

Technical background:
IDOR exposes internal object references.

Attack scenario:
Changing user ID in URL.

Why it is risky:
Access to others' data.

How to fix it securely:
- Check authorization
- Use indirect IDs

Safer coding recommendation:
Never trust user IDs.
""".strip()

    else:
        explanation_text = f"""
Issue: {vulnerability.title}
Severity: {vulnerability.severity}
Description: {description}

What this means:
This is a general security issue.

Why it is risky:
Can compromise system integrity.

How to fix it securely:
{recommendation}

Safer coding recommendation:
Follow secure coding practices.
""".strip()

    explanation = Explanation(
        vulnerability_id=vulnerability.id,
        user_id=vulnerability.user_id,
        retrieved_context=retrieved_context,
        explanation_text=explanation_text,
    )

    db.add(explanation)
    db.commit()
    db.refresh(explanation)

    return explanation