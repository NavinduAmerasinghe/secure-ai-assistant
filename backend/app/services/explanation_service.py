from sqlalchemy.orm import Session

import os
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.models.explanation import Explanation
from app.models.vulnerability import Vulnerability
from app.rag.prompt_builder import build_explanation_prompt
from app.rag.retriever import get_retriever

from app.services.local_explanation_helper import generate_local_explanation


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
    USE_AI_EXPLANATIONS = os.getenv("USE_AI_EXPLANATIONS", "true").lower() == "true"
    fallback_fields = {
        "tool": vulnerability.tool,
        "rule_id": vulnerability.rule_id,
        "title": vulnerability.title,
        "severity": vulnerability.severity,
        "description": vulnerability.description,
        "recommendation": vulnerability.recommendation,
        "file_path": vulnerability.file_path,
        "line_number": vulnerability.line_number,
    }

    retrieved_context = None
    explanation_text = None

    def save_explanation(text, context=None):
        explanation = Explanation(
            vulnerability_id=vulnerability.id,
            user_id=vulnerability.user_id,
            retrieved_context=context,
            explanation_text=text,
        )
        db.add(explanation)
        db.commit()
        db.refresh(explanation)
        return explanation

    if not USE_AI_EXPLANATIONS:
        # Always use fallback
        local = generate_local_explanation(fallback_fields)
        explanation_text = (
            f"Summary: {local['summary']}\n"
            f"Type: {local['issue_type']}\n"
            f"Risk: {local['risk']}\n"
            f"Why it matters: {local['why_it_matters']}\n"
            f"Attack scenario: {local['likely_attack_scenario']}\n"
            f"Fix: {local['likely_fix']}\n"
            f"Secure coding note: {local['secure_coding_note']}"
        )
        return save_explanation(explanation_text)

    # Try AI path, fallback on error
    try:
        retriever = get_retriever()
        query = f"{vulnerability.title} {vulnerability.description or ''} {vulnerability.recommendation or ''}"
        docs = retriever.invoke(query)
        retrieved_context = "\n\n".join(doc.page_content for doc in docs)
        prompt = build_explanation_prompt(
            title=vulnerability.title,
            severity=vulnerability.severity,
            description=vulnerability.description,
            recommendation=vulnerability.recommendation,
            retrieved_context=retrieved_context,
        )
        llm = ChatOpenAI(
            api_key=settings.openai_api_key,
            model=settings.openai_model,
            temperature=0,
        )
        response = llm.invoke(prompt)
        explanation_text = response.content if hasattr(response, "content") else str(response)
        return save_explanation(explanation_text, retrieved_context)
    except Exception:
        local = generate_local_explanation(fallback_fields)
        explanation_text = (
            f"Summary: {local['summary']}\n"
            f"Type: {local['issue_type']}\n"
            f"Risk: {local['risk']}\n"
            f"Why it matters: {local['why_it_matters']}\n"
            f"Attack scenario: {local['likely_attack_scenario']}\n"
            f"Fix: {local['likely_fix']}\n"
            f"Secure coding note: {local['secure_coding_note']}"
        )
        return save_explanation(explanation_text)