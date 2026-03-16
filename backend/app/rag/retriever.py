from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from app.core.config import settings
from app.rag.knowledge_loader import load_knowledge_documents


def build_vectorstore():
    documents = load_knowledge_documents("knowledge_base")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    split_docs = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(api_key=settings.openai_api_key)

    vectorstore = Chroma.from_documents(
        documents=split_docs,
        embedding=embeddings,
        persist_directory=settings.vector_db_path,
    )

    return vectorstore


def get_retriever():
    embeddings = OpenAIEmbeddings(api_key=settings.openai_api_key)

    vectorstore = Chroma(
        persist_directory=settings.vector_db_path,
        embedding_function=embeddings,
    )

    return vectorstore.as_retriever(search_kwargs={"k": 3})