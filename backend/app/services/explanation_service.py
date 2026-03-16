from sqlalchemy.orm import Session
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.models.explanation import Explanation
from app.models.vulnerability import Vulnerability
from app.rag.prompt_builder import build_explanation_prompt
from app.rag.retriever import get_retriever


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