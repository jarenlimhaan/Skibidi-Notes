# External Imports
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
import os
import uuid

# Internal Imports
from config.env import get_app_configs
from .integrations.langchain.base import get_summarizer_service
from .integrations.langchain.base import Summarizer

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
):
    filename = request.query_params.get("filename") or file.filename
    file_id = uuid.uuid4().hex
    save_path = os.path.join(upload_directory_path, f"{file_id}_{filename}")
    try:
        content = await file.read()
        with open(save_path, "wb") as buffer:
            buffer.write(content)

        with open(save_path, "r+") as f:
            res = summarizer.process_pdf(save_path)
            print(res)

        return JSONResponse(content={"url": f"test.url", "summary": res})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"error": str(e)})
