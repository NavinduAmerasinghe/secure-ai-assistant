import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.core.database import Base
from app.models.scan_result import ScanResult
from app.models.submission import Submission
from app.models.user import User
from app.models.vulnerability import Vulnerability
from app.services.explanation_service import (
    create_explanation_for_vulnerability,
    get_explanation_by_vulnerability,
    get_vulnerability_by_id,
)


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def test_create_explanation_for_sql_injection(db_session):
    user = User(
        email="tester@example.com",
        username="tester",
        hashed_password="hashed-password",
        is_active=True,
    )
    db_session.add(user)
    db_session.flush()

    submission = Submission(
        user_id=user.id,
        input_type="paste",
        language="python",
        content="SELECT * FROM users WHERE id = '" + "user_input" + "'",
    )
    db_session.add(submission)
    db_session.flush()

    scan_result = ScanResult(
        submission_id=submission.id,
        user_id=user.id,
        status="completed",
        summary="SQL injection found",
    )
    db_session.add(scan_result)
    db_session.flush()

    vulnerability = Vulnerability(
        scan_result_id=scan_result.id,
        submission_id=submission.id,
        user_id=user.id,
        tool="bandit",
        rule_id="B608",
        title="SQL Injection",
        severity="HIGH",
        description="User input is concatenated into an SQL query.",
        recommendation="Use parameterized queries.",
        file_path="app/db.py",
        line_number=12,
    )
    db_session.add(vulnerability)
    db_session.commit()

    explanation = create_explanation_for_vulnerability(db_session, vulnerability)

    assert explanation.id is not None
    assert "SQL Injection" in explanation.explanation_text
    assert "parameterized queries" in explanation.explanation_text.lower()
    assert explanation.vulnerability_id == vulnerability.id

    fetched_explanation = get_explanation_by_vulnerability(
        db_session,
        vulnerability.id,
        user.id,
    )

    assert fetched_explanation is not None
    assert fetched_explanation.id == explanation.id


def test_get_vulnerability_by_id_returns_none_for_missing_row(db_session):
    assert get_vulnerability_by_id(db_session, 9999) is None


def test_get_explanation_by_vulnerability_returns_none_when_missing(db_session):
    user = User(
        email="missing@example.com",
        username="missing",
        hashed_password="hashed-password",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()

    assert get_explanation_by_vulnerability(db_session, 1234, user.id) is None


def test_create_explanation_for_generic_issue_uses_fallback_guidance(db_session):
    user = User(
        email="generic@example.com",
        username="generic",
        hashed_password="hashed-password",
        is_active=True,
    )
    db_session.add(user)
    db_session.flush()

    submission = Submission(
        user_id=user.id,
        input_type="paste",
        language="python",
        content="print('hello')",
    )
    db_session.add(submission)
    db_session.flush()

    scan_result = ScanResult(
        submission_id=submission.id,
        user_id=user.id,
        status="completed",
        summary="Generic issue found",
    )
    db_session.add(scan_result)
    db_session.flush()

    vulnerability = Vulnerability(
        scan_result_id=scan_result.id,
        submission_id=submission.id,
        user_id=user.id,
        tool="bandit",
        rule_id="B999",
        title="Insecure Default Configuration",
        severity="MEDIUM",
        description="The application is using unsafe default settings.",
        recommendation="Review configuration and disable insecure defaults.",
        file_path="app/config.py",
        line_number=8,
    )
    db_session.add(vulnerability)
    db_session.commit()

    explanation = create_explanation_for_vulnerability(db_session, vulnerability)

    assert explanation.id is not None
    assert "insecure default configuration" in explanation.explanation_text.lower()
    assert "review configuration" in explanation.explanation_text.lower()


def test_create_explanation_for_command_injection_uses_command_specific_guidance(db_session):
    user = User(
        email="command@example.com",
        username="commanduser",
        hashed_password="hashed-password",
        is_active=True,
    )
    db_session.add(user)
    db_session.flush()

    submission = Submission(
        user_id=user.id,
        input_type="paste",
        language="python",
        content="os.system(user_input)",
    )
    db_session.add(submission)
    db_session.flush()

    scan_result = ScanResult(
        submission_id=submission.id,
        user_id=user.id,
        status="completed",
        summary="Command injection found",
    )
    db_session.add(scan_result)
    db_session.flush()

    vulnerability = Vulnerability(
        scan_result_id=scan_result.id,
        submission_id=submission.id,
        user_id=user.id,
        tool="bandit",
        rule_id="B605",
        title="Command Injection",
        severity="HIGH",
        description="User input reaches a shell command.",
        recommendation="Avoid shell execution and validate inputs.",
        file_path="app/commands.py",
        line_number=18,
    )
    db_session.add(vulnerability)
    db_session.commit()

    explanation = create_explanation_for_vulnerability(db_session, vulnerability)

    assert explanation.id is not None
    assert "command injection" in explanation.explanation_text.lower()
    assert "shell" in explanation.explanation_text.lower()


def test_create_explanation_for_xss_uses_xss_specific_guidance(db_session):
    user = User(
        email="xss@example.com",
        username="xssuser",
        hashed_password="hashed-password",
        is_active=True,
    )
    db_session.add(user)
    db_session.flush()

    submission = Submission(
        user_id=user.id,
        input_type="paste",
        language="javascript",
        content="element.innerHTML = userInput;",
    )
    db_session.add(submission)
    db_session.flush()

    scan_result = ScanResult(
        submission_id=submission.id,
        user_id=user.id,
        status="completed",
        summary="XSS found",
    )
    db_session.add(scan_result)
    db_session.flush()

    vulnerability = Vulnerability(
        scan_result_id=scan_result.id,
        submission_id=submission.id,
        user_id=user.id,
        tool="semgrep",
        rule_id="jsx-xss",
        title="Cross-Site Scripting (XSS)",
        severity="HIGH",
        description="User-controlled content is rendered without escaping.",
        recommendation="Escape output before rendering it in the browser.",
        file_path="src/components/Profile.jsx",
        line_number=22,
    )
    db_session.add(vulnerability)
    db_session.commit()

    explanation = create_explanation_for_vulnerability(db_session, vulnerability)

    assert explanation.id is not None
    assert "xss" in explanation.explanation_text.lower()
    assert "escape output" in explanation.explanation_text.lower()