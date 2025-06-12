from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
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

    def __summarize(self, documents: List[Document]) -> dict:
        text = "\n\n".join(doc.page_content for doc in documents)

        prompt = PromptTemplate.from_template(
            """
            You are a helpful assistant.

            Given the following document text, do the following:
            1. Write a concise summary (3-5 sentences).
            2. Extract 5-7 key points as bullet points.

            Return the output in this JSON format:

            {{
              "summary": "...",
              "keypoints": ["...", "..."]
            }}

            Text:
            {text}
            """
        )

        chain = LLMChain(llm=self.llm, prompt=prompt)
        response = chain.run(text=text)

        # Attempt to safely eval the returned string into a dict
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "summary": response,
                "keypoints": []
            }

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
        result = self.__summarize(chunks)

        return {
            "summary": result.get("summary", ""),
            "keypoints": result.get("keypoints", []),
            # "quiz": self.__generate_quiz(result["summary"])  # Optional
        }
