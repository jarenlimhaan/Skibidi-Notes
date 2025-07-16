# External Imports
from pydantic import BaseModel
from uuid import UUID


class CreateUploadSchema(BaseModel):
    user_id: UUID
    file_path: str
    project_name: str


class CreateGenerationSchema(BaseModel):
    user_id: UUID
    file_path: str
    upload_id: UUID
    background_type: str
