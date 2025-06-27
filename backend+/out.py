from elevenlabs.client import ElevenLabs
from elevenlabs import play, save
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import Document
from typing import List
import os
import json
import time
import os
import srt_equalizer
import assemblyai as aai
from typing import List
from moviepy.editor import *
from termcolor import colored
from dotenv import load_dotenv
from datetime import timedelta
from moviepy.video.tools.subtitles import SubtitlesClip
from uuid import *

from moviepy import * 



ELEVEN_LABS_API_KEY = "sk_246b24b9d53c0daf8013e337e90f64ebe87a280e5478cede"

## tts
def tts(sentence, filename):
    client = ElevenLabs(api_key="sk_246b24b9d53c0daf8013e337e90f64ebe87a280e5478cede")

    audio = client.text_to_speech.convert(
        text=sentence,
        voice_id="e02TCHG9lAYD9pABEDcr",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    save(audio, filename)

OPENAI_API_KEY = "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"

class Summarizer:
    def __init__(self):
        self.llm = ChatOpenAI(
            temperature=0.5, 
            openai_api_key= OPENAI_API_KEY,
            model_name="gpt-3.5-turbo"  # Specify model explicitly
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
            separators=["\n\n", "\n", " ", ""]
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
                return {
                    "summary": response.strip(),
                    "keypoints": []
                }
        except Exception as e:
            print(f"Error in batch summarization: {str(e)}")
            return {
                "summary": f"Error summarizing batch: {str(e)}",
                "keypoints": []
            }
    
    def __combine_summaries(self, batch_results: List[dict]) -> dict:
        """Combine multiple batch summaries into final summary"""
        if not batch_results:
            return {"summary": "No content to summarize", "keypoints": []}
        
        # Extract all summaries and keypoints
        all_summaries = [result.get("summary", "") for result in batch_results if result.get("summary")]
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
                summaries=combined_text,
                keypoints="; ".join(all_keypoints)
            )
            
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {
                    "summary": response.strip(),
                    "keypoints": all_keypoints[:8]  # Return first 8 keypoints as fallback
                }
        except Exception as e:
            print(f"Error combining summaries: {str(e)}")
            return {
                "summary": combined_text[:500] + "..." if len(combined_text) > 500 else combined_text,
                "keypoints": all_keypoints[:8]
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
            batch = documents[i:i + self.batch_size]
            batch_text = "\n\n".join(doc.page_content for doc in batch)
            batch_tokens = self.__estimate_tokens(batch_text)
            
            print(f"Processing batch {i//self.batch_size + 1}/{(len(documents)-1)//self.batch_size + 1} "
                  f"({batch_tokens} estimated tokens)")
            
            # If single batch is still too large, split further
            if batch_tokens > self.max_tokens_per_request:
                # Process individual chunks in this batch
                for doc in batch:
                    if self.__estimate_tokens(doc.page_content) <= self.max_tokens_per_request:
                        result = self.__summarize_batch(doc.page_content)
                        batch_results.append(result)
                    else:
                        # Skip extremely large chunks with warning
                        print(f"Warning: Skipping oversized chunk ({len(doc.page_content)} chars)")
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
                    "keypoints": []
                }
            
            # Load PDF
            raw_docs = self.__load_pdf(file_path)
            if not raw_docs:
                return {
                    "error": "No content found in PDF",
                    "summary": "",
                    "keypoints": []
                }
            
            # Create chunks
            chunks = self.__chunk_documents(raw_docs)
            if not chunks:
                return {
                    "error": "Failed to create chunks from PDF",
                    "summary": "",
                    "keypoints": []
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
                "total_chunks": len(chunks)
            }
            
            if quiz:
                final_result["quiz"] = quiz
            
            print("PDF processing completed successfully!")
            return final_result
            
        except Exception as e:
            error_msg = f"Error processing PDF: {str(e)}"
            print(error_msg)
            return {
                "error": error_msg,
                "summary": "",
                "keypoints": []
            }

## Script 
def generate_script(pdf_path):
    instance = Summarizer()
    return instance.process_pdf(pdf_path)["summary"]
     

## Movie.py parts

import os
import uuid
import srt_equalizer
import assemblyai as aai
from typing import List
from moviepy.editor import *
from termcolor import colored
from dotenv import load_dotenv
from datetime import timedelta
from moviepy.video.tools.subtitles import SubtitlesClip

ASSEMBLY_AI_API_KEY = "f02188682d624cc8b72a0dd1493ae3cd"

def __generate_subtitles_assemblyai(audio_path: str, voice: str) -> str:
    language_mapping = {"br": "pt", "id": "en", "jp": "ja", "kr": "ko"}
    lang_code = language_mapping.get(voice, voice)
    aai.settings.api_key = ASSEMBLY_AI_API_KEY
    config = aai.TranscriptionConfig(language_code=lang_code)
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(audio_path)
    return transcript.export_subtitles_srt()

def __generate_subtitles_locally(sentences: List[str], audio_clips: List[AudioFileClip]) -> str:
    def convert_to_srt_time(total_seconds):
        return str(timedelta(seconds=total_seconds)).rstrip('0').replace('.', ',')
    start_time = 0
    subtitles = []
    for i, (sentence, audio_clip) in enumerate(zip(sentences, audio_clips), start=1):
        duration = audio_clip.duration
        end_time = start_time + duration
        subtitles.append(f"{i}\n{convert_to_srt_time(start_time)} --> {convert_to_srt_time(end_time)}\n{sentence}\n")
        start_time += duration
    return "\n".join(subtitles)

def generate_subtitles(audio_path: str, sentences: List[str], audio_clips: List[AudioFileClip], voice: str) -> str:
    def equalize_subtitles(srt_path: str, max_chars: int = 10) -> None:
        srt_equalizer.equalize_srt_file(srt_path, srt_path, max_chars)
    subtitles_path = f"subtitles/{uuid.uuid4()}.srt"
    if ASSEMBLY_AI_API_KEY:
        print(colored("[+] Creating subtitles using AssemblyAI", "blue"))
        subtitles = __generate_subtitles_assemblyai(audio_path, voice)
    else:
        print(colored("[+] Creating subtitles locally", "blue"))
        subtitles = __generate_subtitles_locally(sentences, audio_clips)
    with open(subtitles_path, "w") as file:
        file.write(subtitles)
    equalize_subtitles(subtitles_path)
    print(colored("[+] Subtitles generated.", "green"))
    return subtitles_path

def combine_videos(video_paths: List[str], max_duration: int, threads: int) -> str:
    video_id = uuid.uuid4()
    combined_video_path = f"temp/{video_id}.mp4"
    base_clip = VideoFileClip(video_paths[0]).without_audio()
    clips = []
    total_duration = 0
    while total_duration < max_duration:
        clip = base_clip
        remaining = max_duration - total_duration
        if clip.duration > remaining:
            clip = clip.subclip(0, remaining)
        clips.append(clip)
        total_duration += clip.duration
    final_clip = concatenate_videoclips(clips).set_fps(30).resize((1080, 1920))
    final_clip.write_videofile(combined_video_path, threads=threads)
    return combined_video_path

def generate_video(combined_video_path: str, tts_path: str, subtitles_path: str, threads: int, subtitles_position: str, text_color: str) -> str:
    generator = lambda txt: TextClip(
        txt,
        font="fonts/bold_font.ttf",
        fontsize=100,
        color=text_color,
        stroke_color="black",
        stroke_width=5,
    )
    horizontal, vertical = subtitles_position.split(",")
    subtitles = SubtitlesClip(subtitles_path, generator)

    result = CompositeVideoClip([
        VideoFileClip(combined_video_path),
        subtitles.set_pos((horizontal, vertical))
    ]).set_audio(AudioFileClip(tts_path))
    result.write_videofile("temp/output.mp4", threads=threads or 2)
    return "output.mp4"

## utils
def clean_dir(path: str) -> None:
    if not os.path.exists(path):
        os.mkdir(path)
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        os.remove(file_path)


if __name__ == "__main__":

    clean_dir("temp/")
    clean_dir("subtitles/")

    
    ## Constants 
    video_paths = ["subway.mp4"]
    pdf_path = "bq.pdf"
    n_threads = 2
    subtitles_position = "center,center"
    text_color = "#FFFF00"

    ## generate script from pdf 
    script = generate_script(pdf_path)
    # 
    # script ='Did you know that if you had 10 billion $1 coins and spent one every second of every day, it would take 317 years to go broke? Imagine having that kind of financial freedom. Would you be happy? I certainly believed so until I paused and considered my current circumstance: " Am I not happy already?” This simple yet thought-provoking question opened the floodgates to deeper reflections: What is happiness? Can it be defined? And does money buy happiness?'

    sentences = script.split(". ")
    sentences = list(filter(lambda x: x != "", sentences))
    paths = []
    for sentence in sentences:
        # if not GENERATING:
        #     return jsonify({"status": "error", "message": "Video generation was cancelled."})
        current_tts_path = f"temp/{uuid4()}.mp3"
        tts(sentence, filename=current_tts_path)
        audio_clip = AudioFileClip(current_tts_path)
        paths.append(audio_clip)

    final_audio = concatenate_audioclips(paths)
    tts_path = f"temp/{uuid4()}.mp3"
    final_audio.write_audiofile(tts_path)

    voice_prefix = "en"
    subtitles_path = generate_subtitles(audio_path=tts_path, sentences=sentences, audio_clips=paths, voice=voice_prefix)

    temp_audio = AudioFileClip(tts_path)
    combined_video_path = combine_videos(video_paths, temp_audio.duration, n_threads or 2)
    final_video_path = generate_video(combined_video_path, tts_path, subtitles_path, n_threads or 2, subtitles_position, text_color or "#FFFF00")

    video_clip = VideoFileClip(f"{final_video_path}")