# External Imports
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import os
import uuid

# Internal Imports
from config.env import get_app_configs
from .integrations.langchain.base import Summarizer, get_summarizer_service
from .integrations.elevenlabs.base import TTS, get_TTS
from .integrations.movieclip.base import Clip, get_clip
from .integrations.subtitles.base import Subtitles, get_subtitles

from .generator_service import GenerationService
from src.deps import get_current_user_from_cookie, get_generation_service, get_db, get_qa_service

router = APIRouter()
app_config = get_app_configs()

# Check if upload file path exists
upload_directory_path = app_config.UPLOAD_DIR
os.makedirs(upload_directory_path, exist_ok=True)

# Main entrypoint for video generation & file upload
# This endpoint handles the file upload and video generation process
@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    background: str = Form(...),
    voice: str = Form(...),
    quizCount: str = Form(...),
    summarizer: Summarizer = Depends(get_summarizer_service),
    tts: TTS = Depends(get_TTS),
    subtitles: Subtitles = Depends(get_subtitles),
    clip: Clip = Depends(get_clip),
    generation_service: GenerationService = Depends(get_generation_service),
    qa_service = Depends(get_qa_service),
    current_user=Depends(get_current_user_from_cookie),
    db: AsyncSession = Depends(get_db)
):
    filename = request.query_params.get("filename") or file.filename
    file_id = uuid.uuid4().hex
    save_path = os.path.join(upload_directory_path, f"{file_id}_{filename}")
    try:
        content = await file.read()
        with open(save_path, "wb") as buffer:
            buffer.write(content)

        # Create Video Generation
        path, res = await generation_service.generate(pdf_path=save_path, summarizer=summarizer, tts=tts, clip=clip, subtitles=subtitles, background=background, voice_id=voice, quizcount=quizCount)

        # Add to Vector Store
        qa_service.add_pdf_to_vectorstore(file_path=save_path, user_id=current_user["user_id"]) 

        # Save the generation to the database    
        # result = await generation_service.save_upload_and_generation(
        #     user_id=current_user["user_id"],
        #     save_path=save_path,
        #     generation_path=path,
        #     db=db
        # )

        return JSONResponse(content={"url": path, "summary": {
            "summary": res['summary'],
            "keypoints": res['keypoints'],
            "url": path
        }})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})

# Fetch user uploaded file with their generated video
@router.get("/upload/{upload_id}")
async def fetch_file(upload_id: str, generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user_from_cookie)):
    try:
        upload = await generation_service.get_user_upload_by_id(upload_id, db)
        if not upload:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Fetch the generation associated with the upload
        generations = await generation_service.get_user_generations_from_upload_id(upload_id, db)
        if not generations:
            raise HTTPException(status_code=404, detail="Generation not found")

        return JSONResponse(content={
            "upload": upload,
            "generation": generations
        })
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

# Fetch all user uploads
@router.get("/uploads")
async def fetch_all_uploads(current_user=Depends(get_current_user_from_cookie), generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db)):
    try:
        uploads = await generation_service.get_all_uploads(current_user["user_id"], db)
        if not uploads:
            return JSONResponse(content={"message": "No uploads found"}, status_code=404)
        return JSONResponse(content=uploads)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

# Fetch all user upload with their generated video 
@router.get("/uploads_with_generations")
async def fetch_all_uploads_with_generations(current_user=Depends(get_current_user_from_cookie), generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db)):
    try:
        uploads = await generation_service.get_user_uploads_with_generations(current_user["user_id"], db)
        if not uploads:
            return JSONResponse(content={"message": "No uploads found"}, status_code=404)
        return JSONResponse(content=uploads)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

# Delete user uploaded file 
@router.delete("/delete/upload/{upload_id}")
async def delete_file(upload_id: str, generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db)):

    try:
        # Retrieve from db the file path using the upload_id
        upload = await generation_service.get_user_upload_by_id(upload_id, db)
        if not upload:
            raise HTTPException(status_code=404, detail="File not found")
        file_path = upload["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)
            await generation_service.delete_user_upload(upload_id, db)
            return JSONResponse(content={"status": "File deleted successfully"})
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
# Delete user generation
@router.delete("/delete/generation/{generation_id}")
async def delete_generation(generation_id: str, generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db)):

    try:
        # Retrieve the generation from db using the generation_id
        generation = await generation_service.get_user_generations_from_upload_id(generation_id, db)
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        return JSONResponse(content={"status": "Generation deleted successfully"})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
# Delete user upload and its associated generations
@router.delete("/delete/upload_with_generations/{upload_id}")
async def delete_upload_with_generations(upload_id: str, generation_service: GenerationService = Depends(get_generation_service), db: AsyncSession = Depends(get_db)):

    try:
        await generation_service.delete_upload_with_generations(upload_id, db)

        return JSONResponse(content={"status": "Upload and associated generations deleted successfully"})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

