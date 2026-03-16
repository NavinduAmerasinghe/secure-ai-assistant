from pathlib import Path

from langchain_core.documents import Document


def load_knowledge_documents(knowledge_dir: str) -> list[Document]:
    documents = []
    path = Path(knowledge_dir)

    if not path.exists():
        return documents

    for file_path in path.glob("*.txt"):
        content = file_path.read_text(encoding="utf-8")
        documents.append(
            Document(
                page_content=content,
                metadata={"source": file_path.name}
            )
        )

    return documents