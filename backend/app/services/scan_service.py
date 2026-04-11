from sqlalchemy.orm import Session

from app.models.scan_result import ScanResult
from app.models.submission import Submission
from app.models.vulnerability import Vulnerability
from app.scanners.bandit_scanner import run_bandit
from app.scanners.normalizer import normalize_severity
from app.scanners.secret_scanner import run_secret_scan

from app.scanners.semgrep_scanner import run_semgrep
from app.scanners.snyk_scanner import run_snyk_scan


def _normalize_semgrep_results(results: list[dict]) -> list[dict]:
    normalized = []
    for item in results:
        extra = item.get("extra", {})
        metadata = extra.get("metadata", {})

        normalized.append(
            {
                "tool": "semgrep",
                "rule_id": item.get("check_id"),
                "title": extra.get("message", "Semgrep finding"),
                "severity": normalize_severity(extra.get("severity")),
                "description": extra.get("message", "Potential security issue detected by Semgrep."),
                "recommendation": metadata.get(
                    "fix",
                    "Review the affected code and apply secure coding best practices.",
                ),
                "file_path": item.get("path"),
                "line_number": item.get("start", {}).get("line"),
            }
        )
    return normalized


def _normalize_bandit_results(results: list[dict]) -> list[dict]:
    normalized = []
    for item in results:
        normalized.append(
            {
                "tool": "bandit",
                "rule_id": item.get("test_id"),
                "title": item.get("issue_text", "Bandit finding"),
                "severity": normalize_severity(item.get("issue_severity")),
                "description": item.get("issue_text", "Potential Python security issue detected."),
                "recommendation": "Review this Python code pattern and replace it with a safer implementation.",
                "file_path": item.get("filename"),
                "line_number": item.get("line_number"),
            }
        )
    return normalized


def run_scan_for_submission(db: Session, submission: Submission) -> ScanResult:
    findings: list[dict] = []

    content = ""
    target_path = None

    if submission.input_type == "paste":
        content = submission.content or ""
    elif submission.input_type == "file":
        target_path = submission.file_path
        try:
            with open(submission.file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            content = ""

    if target_path:
        findings.extend(_normalize_semgrep_results(run_semgrep(target_path)))
        findings.extend(_normalize_bandit_results(run_bandit(target_path)))
        findings.extend(run_snyk_scan(target_path))
    else:
        # For pasted code, write to a temporary file later if you want richer scanning.
        # For now, only secret scan is guaranteed to run on pasted content.
        pass

    findings.extend(run_secret_scan(content=content, file_path=target_path))

    scan_result = ScanResult(
        submission_id=submission.id,
        user_id=submission.user_id,
        status="completed",
        summary=f"{len(findings)} findings detected",
    )
    db.add(scan_result)
    db.commit()
    db.refresh(scan_result)

    for finding in findings:
        vulnerability = Vulnerability(
            scan_result_id=scan_result.id,
            submission_id=submission.id,
            user_id=submission.user_id,
            tool=finding["tool"],
            rule_id=finding.get("rule_id"),
            title=finding["title"],
            severity=finding["severity"],
            description=finding.get("description"),
            recommendation=finding.get("recommendation"),
            file_path=finding.get("file_path"),
            line_number=finding.get("line_number"),
        )
        db.add(vulnerability)

    db.commit()
    return scan_result


def get_scan_result_with_vulnerabilities(db: Session, scan_result_id: int, user_id: int):
    scan_result = (
        db.query(ScanResult)
        .filter(ScanResult.id == scan_result_id, ScanResult.user_id == user_id)
        .first()
    )

    if not scan_result:
        return None

    vulnerabilities = (
        db.query(Vulnerability)
        .filter(Vulnerability.scan_result_id == scan_result.id, Vulnerability.user_id == user_id)
        .order_by(Vulnerability.created_at.desc())
        .all()
    )

    return scan_result, vulnerabilities


def get_scans_for_submission(db: Session, submission_id: int, user_id: int):
    return (
        db.query(ScanResult)
        .filter(ScanResult.submission_id == submission_id, ScanResult.user_id == user_id)
        .order_by(ScanResult.created_at.desc())
        .all()
    )