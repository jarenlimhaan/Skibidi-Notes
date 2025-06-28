# External Imports 
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import Document
from typing import List
import os
import json
import time

# Internal Imports
from config.env import get_app_configs

app_config = get_app_configs()

class Summarizer:
    def __init__(self):
        self.llm = ChatOpenAI(
            temperature=0.5,
            openai_api_key=app_config.OPEN_AI_API_KEY,
            model_name="gpt-3.5-turbo",  # Specify model explicitly
        )
        self.max_tokens_per_request = 3000  # Conservative limit
        self.batch_size = 5  # Number of chunks per batch

    def __load_pdf(self, file_path: str) -> List[Document]:
        """Load PDF and return documents"""
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            print(f"Successfully loaded {len(documents)} pages from PDF")
            return documents
        except Exception as e:
            print(f"Error loading PDF: {str(e)}")
            raise

    def __chunk_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into manageable chunks"""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,  # Increased chunk size
            chunk_overlap=100,  # Reduced overlap
            separators=["\n\n", "\n", " ", ""],
        )
        chunks = splitter.split_documents(documents)
        print(f"Created {len(chunks)} chunks from documents")
        return chunks

    def __estimate_tokens(self, text: str) -> int:
        """Rough estimation of tokens (1 token ≈ 4 characters)"""
        return len(text) // 4

    def __summarize_batch(self, batch_text: str) -> dict:
        """Summarize a batch of text"""
        prompt = PromptTemplate.from_template(
            """
            You are a helpful assistant that creates concise summaries.
            Summarize the following text in 2-3 sentences and extract 3-4 key points.
            
            Return your response in this exact JSON format:
            {{
              "summary": "Your 2-3 sentence summary here",
              "keypoints": ["Key point 1", "Key point 2", "Key point 3"]
            }}
            
            Text to summarize:
            {text}
            """
        )

        try:
            chain = LLMChain(llm=self.llm, prompt=prompt)
            response = chain.run(text=batch_text)

            # Try to parse JSON response
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {"summary": response.strip(), "keypoints": []}
        except Exception as e:
            print(f"Error in batch summarization: {str(e)}")
            return {"summary": f"Error summarizing batch: {str(e)}", "keypoints": []}

    def __combine_summaries(self, batch_results: List[dict]) -> dict:
        """Combine multiple batch summaries into final summary"""
        if not batch_results:
            return {"summary": "No content to summarize", "keypoints": []}

        # Extract all summaries and keypoints
        all_summaries = [
            result.get("summary", "")
            for result in batch_results
            if result.get("summary")
        ]
        all_keypoints = []
        for result in batch_results:
            keypoints = result.get("keypoints", [])
            if isinstance(keypoints, list):
                all_keypoints.extend(keypoints)

        # Combine summaries
        combined_text = " ".join(all_summaries)

        prompt = PromptTemplate.from_template(
            """
            You are a helpful assistant that creates comprehensive summaries.
            Based on the following individual summaries, create:
            1. A comprehensive summary (4-6 sentences)
            2. A list of 6-8 most important key points
            
            Return your response in this exact JSON format:
            {{
              "summary": "Your comprehensive summary here",
              "keypoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5", "Key point 6"]
            }}
            
            Individual summaries to combine:
            {summaries}
            
            Additional key points to consider:
            {keypoints}
            """
        )

        try:
            chain = LLMChain(llm=self.llm, prompt=prompt)
            response = chain.run(
                summaries=combined_text, keypoints="; ".join(all_keypoints)
            )

            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {
                    "summary": response.strip(),
                    "keypoints": all_keypoints[
                        :8
                    ],  # Return first 8 keypoints as fallback
                }
        except Exception as e:
            print(f"Error combining summaries: {str(e)}")
            return {
                "summary": (
                    combined_text[:500] + "..."
                    if len(combined_text) > 500
                    else combined_text
                ),
                "keypoints": all_keypoints[:8],
            }

    def __summarize(self, documents: List[Document]) -> dict:
        """Main summarization method with batch processing"""
        if not documents:
            return {"summary": "No documents to summarize", "keypoints": []}

        # Calculate total text length
        total_text = "\n\n".join(doc.page_content for doc in documents)
        total_tokens = self.__estimate_tokens(total_text)

        print(f"Total estimated tokens: {total_tokens}")

        # If document is small enough, process directly
        if total_tokens <= self.max_tokens_per_request:
            print("Document small enough for direct processing")
            return self.__summarize_batch(total_text)

        # Otherwise, process in batches
        print("Document too large, processing in batches")
        batch_results = []

        for i in range(0, len(documents), self.batch_size):
            batch = documents[i : i + self.batch_size]
            batch_text = "\n\n".join(doc.page_content for doc in batch)
            batch_tokens = self.__estimate_tokens(batch_text)

            print(
                f"Processing batch {i//self.batch_size + 1}/{(len(documents)-1)//self.batch_size + 1} "
                f"({batch_tokens} estimated tokens)"
            )

            # If single batch is still too large, split further
            if batch_tokens > self.max_tokens_per_request:
                # Process individual chunks in this batch
                for doc in batch:
                    if (
                        self.__estimate_tokens(doc.page_content)
                        <= self.max_tokens_per_request
                    ):
                        result = self.__summarize_batch(doc.page_content)
                        batch_results.append(result)
                    else:
                        # Skip extremely large chunks with warning
                        print(
                            f"Warning: Skipping oversized chunk ({len(doc.page_content)} chars)"
                        )
            else:
                result = self.__summarize_batch(batch_text)
                batch_results.append(result)

            # Add small delay to avoid rate limiting
            time.sleep(1)

        # Combine all batch results
        return self.__combine_summaries(batch_results)

    def __generate_quiz(self, summary: str) -> str:
        """Generate quiz questions based on summary"""
        if not summary or len(summary.strip()) < 50:
            return "Summary too short to generate meaningful quiz questions."

        prompt = PromptTemplate.from_template(
            """
            You are a helpful assistant that creates educational quizzes.
            Based on the following summary, create 5 multiple-choice questions.
            Each question should have 4 options (A, B, C, D) with one correct answer.
            
            Format your response as:
            
            1. Question text?
            A) Option 1
            B) Option 2  
            C) Option 3
            D) Option 4
            Correct Answer: X
            
            Summary:
            {summary}
            """
        )

        try:
            response = self.llm.predict(prompt.format(summary=summary))
            return response
        except Exception as e:
            print(f"Error generating quiz: {str(e)}")
            return f"Error generating quiz: {str(e)}"

    def process_pdf(self, file_path: str) -> dict:
        """Main method to process PDF and return summary"""
        try:
            print(f"Starting to process PDF: {file_path}")

            # Check if file exists
            if not os.path.exists(file_path):
                return {
                    "error": f"File not found: {file_path}",
                    "summary": "",
                    "keypoints": [],
                }

            # Load PDF
            raw_docs = self.__load_pdf(file_path)
            if not raw_docs:
                return {
                    "error": "No content found in PDF",
                    "summary": "",
                    "keypoints": [],
                }

            # Create chunks
            chunks = self.__chunk_documents(raw_docs)
            if not chunks:
                return {
                    "error": "Failed to create chunks from PDF",
                    "summary": "",
                    "keypoints": [],
                }

            # Summarize
            result = self.__summarize(chunks)

            # Optional: Generate quiz
            quiz = None
            if result.get("summary") and len(result["summary"]) > 100:
                quiz = self.__generate_quiz(result["summary"])

            final_result = {
                "summary": result.get("summary", ""),
                "keypoints": result.get("keypoints", []),
                "total_pages": len(raw_docs),
                "total_chunks": len(chunks),
            }

            if quiz:
                final_result["quiz"] = quiz

            print("PDF processing completed successfully!")
            return final_result

        except Exception as e:
            error_msg = f"Error processing PDF: {str(e)}"
            print(error_msg)
            return {"error": error_msg, "summary": "", "keypoints": []}


def get_summarizer_service() -> Summarizer:
    return Summarizer()
