# External Imports
from fastapi import APIRouter
from fastapi.responses import RedirectResponse, FileResponse

import os

router = APIRouter()

@router.get("/")
def read_root():
    return RedirectResponse(url="/docs")

@router.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join("static/uploads/", filename)
    print(file_path)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )