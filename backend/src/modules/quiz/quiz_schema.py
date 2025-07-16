# External Imports
from pydantic import BaseModel
from uuid import UUID


class CreateQuizSchema(BaseModel):
    upload_id: UUID
    content: list
