## External Imports
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_postgres import PGVector  # Updated import
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains import RetrievalQA
from typing import List


## Internal Imports
from config.env import get_app_configs


class DocumentQAService:
    def __init__(self):
        self.config = get_app_configs()
        self.openai_api_key = self.config.OPEN_AI_API_KEY
        self.db_url = self.config.DATABASE_URL_PGVECTOR
        self.embedding_model = OpenAIEmbeddings(openai_api_key=self.openai_api_key)

    def _split_documents(self, raw_docs) -> List:
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        return splitter.split_documents(raw_docs)

    def add_pdf_to_vectorstore(self, file_path: str, user_id: str):
        loader = PyPDFLoader(file_path)
        raw_documents = loader.load()
        chunks = self._split_documents(raw_documents)

        # Use a per-user collection
        collection_name = f"user_docs_{user_id}"

        # Load or create vectorstore
        PGVector.from_documents(
            documents=chunks,
            embedding=self.embedding_model,
            collection_name=collection_name,
            connection=self.db_url,  # Changed from connection_string to connection
        )

    def ask_question(self, question: str, user_id: str) -> dict:
        collection_name = f"user_docs_{user_id}"

        # Use the regular constructor instead of from_collection_name
        vectorstore = PGVector(
            embeddings=self.embedding_model,
            collection_name=collection_name,
            connection=self.db_url,  # Changed from connection_string to connection
        )

        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

        qa_chain = RetrievalQA.from_chain_type(
            llm=ChatOpenAI(openai_api_key=self.openai_api_key),
            retriever=retriever,
            return_source_documents=True,
        )

        result = qa_chain.invoke({"query": question})
        return result


def get_qa_service() -> DocumentQAService:
    return DocumentQAService()