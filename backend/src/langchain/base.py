from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.chat_models import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from typing import List
import os

from config.env import get_app_configs

app_config = get_app_configs()

class Summarizer:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0.5, openai_api_key=app_config.OPEN_AI_API_KEY)

    def __load_pdf(self, file_path: str) -> List[Document]:
        loader = PyPDFLoader(file_path)
        return loader.load()

    def __chunk_documents(self, documents: List[Document]) -> List[Document]:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        return splitter.split_documents(documents)

    def __summarize(self, documents: List[Document]) -> str:
        chain = load_summarize_chain(self.llm, chain_type="map_reduce")
        return chain.invoke(documents)

    def __generate_quiz(self, summary: str) -> str:
        prompt = PromptTemplate.from_template(
            """
            You are a helpful assistant that creates quizzes.
            Based on the following summary, create 5 multiple-choice questions:
            
            {summary}
            """
        )
        response = self.llm.predict(prompt.format(summary=summary))
        return response

    def process_pdf(self, file_path: str) -> dict:
        raw_docs = self.__load_pdf(file_path)
        chunks = self.__chunk_documents(raw_docs)
        summary = self.__summarize(chunks)
        # quiz = self.generate_quiz(summary)
        return {
            "summary": summary,
            # "quiz": quiz
        }
