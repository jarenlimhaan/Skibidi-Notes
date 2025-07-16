# External Imports
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from celery.result import AsyncResult
from fastapi.encoders import jsonable_encoder
import os
import uuid

# Internal Imports
from config.env import get_app_configs
from .generator_service import GenerationService
from src.modules.chat.chat_service import DocumentQAService
from src.deps import (
    get_current_user_from_cookie,
    get_generation_service,
    get_db,
    get_qa_service,
)

from .runner.tasks import run_generation_task
from .runner.base import celery_app

from src.core.queue.base import redis_client

router = APIRouter()
app_config = get_app_configs()

# Check if upload file path exists
upload_directory_path = app_config.UPLOAD_DIR
os.makedirs(upload_directory_path, exist_ok=True)


# Main entrypoint for video generation & file upload
@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    background: str = Form(...),
    voice: str = Form(...),
    quizCount: str = Form(...),
    noteName: str = Form(...),
    generation_service: GenerationService = Depends(get_generation_service),
    qa_service: DocumentQAService = Depends(get_qa_service),
    current_user=Depends(get_current_user_from_cookie),
    db: AsyncSession = Depends(get_db),
):
    filename = request.query_params.get("filename") or file.filename
    file_id = uuid.uuid4().hex
    save_path = os.path.join(upload_directory_path, f"{file_id}_{filename}")
    user_id = current_user["user_id"]
    try:
        content = await file.read()
        with open(save_path, "wb") as buffer:
            buffer.write(content)

        if "minecraft" in background:
            import random 
            background = random.choice(["minecraft_gameplay_01.mp4", "minecraft_gameplay_02.mp4", "minecraft_gameplay_03.mp4"])

        # Add upload record to DB
        upload_id = await generation_service.add_upload(
            createUploadDTO={
                "user_id": user_id,
                "file_path": save_path,
                "project_name": noteName,
            },
            db=db,
        )

        # Add to Vector Store
        qa_service.add_pdf_to_vectorstore(file_path=save_path, user_id=user_id)

        # Run the generation task
        task = run_generation_task.delay(
            pdf_path=save_path,
            upload_id=upload_id,
            background=background,
            voice_id=voice,
            quizcount=quizCount,
            user_id=user_id,
        )

        # Store in redis
        await redis_client.set(
            f"user:{user_id}:upload:{upload_id}",
            task.id,
            ex=86400,  # optional: expires after 1 day
        )

        print(f"Upload ID: {upload_id}")

        return JSONResponse(content={"id": str(upload_id)})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/status/{upload_id}")
async def get_generation_status(
    upload_id: str,
    current_user=Depends(get_current_user_from_cookie),
):
    user_id = current_user["user_id"]

    # Retrieve task_id from Redis
    task_id = await redis_client.get(f"user:{user_id}:upload:{upload_id}")
    if task_id is None:
        return JSONResponse(status_code=404, content={"status": "Not Found"})

    task_result = AsyncResult(task_id, app=celery_app)

    response = {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.successful() else None,
    }

    # Clean up Redis if done
    if task_result.status in ["SUCCESS", "FAILURE"]:
        await redis_client.delete(f"user:{user_id}:upload:{upload_id}")
        print(f"Task {task_id} removed from Redis")

    return JSONResponse(content=response)


# Fetch user uploaded file with their generated video
@router.get("/upload/{upload_id}")
async def fetch_file(
    upload_id: str,
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_from_cookie),
):
    try:
        upload = await generation_service.get_user_upload_by_id(upload_id, db)
        if not upload:
            raise HTTPException(status_code=404, detail="File not found")

        # Fetch the generation associated with the upload
        generations = await generation_service.get_user_generations_from_upload_id(
            upload_id, db
        )
        if not generations:
            raise HTTPException(status_code=404, detail="Generation not found")

        return JSONResponse(content={"upload": upload, "generation": generations})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Fetch all user uploads
@router.get("/uploads")
async def fetch_all_uploads(
    current_user=Depends(get_current_user_from_cookie),
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):
    try:
        uploads = await generation_service.get_all_uploads(current_user["user_id"], db)
        if not uploads:
            return JSONResponse(content=[], status_code=200)
        return JSONResponse(content=jsonable_encoder(uploads))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Fetch all user upload with their generated video
@router.get("/uploads_with_generations")
async def fetch_all_uploads_with_generations(
    current_user=Depends(get_current_user_from_cookie),
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):
    try:
        uploads = await generation_service.get_user_uploads_with_generations(
            current_user["user_id"], db
        )
        if not uploads:
            return JSONResponse(content=[], status_code=200)
        return JSONResponse(content=jsonable_encoder(uploads))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Delete user uploaded file
@router.delete("/delete/upload/{upload_id}")
async def delete_file(
    upload_id: str,
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):
    try:
        # Retrieve from db the file path using the upload_id
        upload = await generation_service.get_user_upload_by_id(upload_id, db)
        if not upload:
            raise HTTPException(status_code=404, detail="File not found")
        file_path = upload.file_path
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
async def delete_generation(
    generation_id: str,
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):

    try:
        # Retrieve the generation from db using the generation_id
        generation = await generation_service.get_user_generations_from_upload_id(
            generation_id, db
        )
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")

        return JSONResponse(content={"status": "Generation deleted successfully"})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Delete user upload and its associated generations
@router.delete("/delete/upload_with_generations/{upload_id}")
async def delete_upload_with_generations(
    upload_id: str,
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):

    try:
        await generation_service.delete_upload_with_generations(upload_id, db)

        return JSONResponse(
            content={"status": "Upload and associated generations deleted successfully"}
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Updating the project name of an upload
@router.post("/rename/upload/{upload_id}")
async def update_upload_project_name(
    upload_id: str,
    project_name: str = Form(...),
    generation_service: GenerationService = Depends(get_generation_service),
    db: AsyncSession = Depends(get_db),
):
    try:
        updated_upload = await generation_service.update_upload_project_name(
            upload_id, project_name, db
        )
        if not updated_upload:
            raise HTTPException(status_code=404, detail="Upload not found")
        return JSONResponse(
            content={
                "status": "Project name updated successfully",
                "upload": updated_upload,
            }
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
