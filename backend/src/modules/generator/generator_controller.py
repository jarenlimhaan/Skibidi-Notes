# External Imports
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import os
import uuid

# Internal Imports
from config.env import get_app_configs
from .integrations.langchain.base import get_summarizer_service
from .integrations.langchain.base import Summarizer

from .generator_service import GenerationService

from src.deps import get_current_user_from_cookie, get_generation_service, get_db

router = APIRouter()
app_config = get_app_configs()

# Check if upload file path exists
upload_directory_path = app_config.UPLOAD_DIR
os.makedirs(upload_directory_path, exist_ok=True)

@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    summarizer: Summarizer = Depends(get_summarizer_service),
    generation_service: GenerationService = Depends(get_generation_service),
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

        # with open(save_path, "r+") as f:
        #     res = summarizer.process_pdf(save_path)
        #     print(res)

        result = await generation_service.save_upload_and_generation(
            user_id=current_user["user_id"],
            save_path=save_path,
            db=db
        )
        print(result)

        return JSONResponse(content={"url": f"test.url", "summary": {
            "summary": "test",
            "keypoints": ["test1", "test2", "test3"],
        }})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})
