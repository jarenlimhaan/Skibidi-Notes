# External Imports 
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
import shutil
import os
import uuid

# Internal Imports 
from config.env import get_app_configs

router = APIRouter()
app_config = get_app_configs()

upload_directory_path = app_config.UPLOAD_DIR

os.makedirs(upload_directory_path, exist_ok=True)


@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    filename = request.query_params.get("filename") or file.filename
    file_id = uuid.uuid4().hex
    save_path = os.path.join(upload_directory_path, f"{file_id}_{filename}")
    try:
        content = await file.read()  
        with open(save_path, "wb") as buffer:
            buffer.write(content)  
        return JSONResponse(content={"url": f"test.url"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})