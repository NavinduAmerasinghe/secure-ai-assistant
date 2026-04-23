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

        What this means:
        SQL Injection allows attackers to manipulate database queries by injecting malicious SQL code, potentially exposing or corrupting sensitive data.

        Why it is risky:
        Attackers can bypass authentication, extract, modify, or delete data, and even execute administrative operations on the database.

        How to fix it securely:
        Always use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries.

        Safer coding recommendation:
        Validate and sanitize all user inputs. Use ORM libraries or query builders that prevent injection by design.
        """.strip()
    elif 'xss' in title_lower or 'cross-site scripting' in title_lower:
        explanation_text = f"""
        Issue: {vulnerability.title}
        Severity: {vulnerability.severity}
        Description: {description}

        What this means:
        Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users, leading to data theft or session hijacking.

        Why it is risky:
        XSS can compromise user accounts, steal cookies, or deface websites, impacting user trust and application security.

        How to fix it securely:
        Properly escape and encode all user-supplied data before rendering it in the browser. Use frameworks that auto-escape output.

        Safer coding recommendation:
        Implement Content Security Policy (CSP) headers and validate all inputs on both client and server sides.
        """.strip()
    elif 'hardcoded secret' in title_lower or 'secret' in title_lower:
        explanation_text = f"""
        Issue: {vulnerability.title}
        Severity: {vulnerability.severity}
        Description: {description}

        What this means:
        Hardcoded secrets (like API keys or passwords) in code can be easily discovered and abused if the codebase is leaked or shared.

        Why it is risky:
        Attackers can use these secrets to access sensitive systems, data, or third-party services, leading to breaches or financial loss.

        How to fix it securely:
        Store secrets in environment variables or secure vaults, never directly in source code.

        Safer coding recommendation:
        Regularly rotate secrets and audit your codebase for accidental exposures.
        """.strip()
    else:
        explanation_text = f"""
        Issue: {vulnerability.title}
        Severity: {vulnerability.severity}
        Description: {description}

        What this means:
        {vulnerability.title} is a security issue that can impact your application. {description}

        Why it is risky:
        This vulnerability can be exploited by attackers to compromise the security or integrity of your system. Severity: {vulnerability.severity}.

        How to fix it securely:
        {recommendation}

        Safer coding recommendation:
        Always validate inputs, use secure libraries, and keep dependencies up to date. Regularly review code for common security flaws related to this issue.
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