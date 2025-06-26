from pydantic import BaseModel
from uuid import UUID

class CreateUploadSchema(BaseModel):
    user_id: UUID
    file_path: str

class CreateGenerationSchema(BaseModel):
    user_id: UUID
    file_path:str
    uploaded_file_path: UUID