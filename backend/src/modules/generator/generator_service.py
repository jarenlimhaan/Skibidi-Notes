# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

# Internal Imports
from .generator_schema import CreateUploadSchema, CreateGenerationSchema
from .generator_model import Uploads, Generations

class GenerationService:

    async def add_upload(self, createUploadDTO: CreateUploadSchema,  db: AsyncSession):
        new_upload = Uploads(
            user_id = createUploadDTO["user_id"],
            file_path = createUploadDTO["file_path"]
        )

        db.add(new_upload)
        await db.commit()
        await db.refresh(new_upload)
        return {"status": "Success", "upload_id": new_upload.id}

    async def add_generation(self, createGenerationDTO: CreateGenerationSchema, db: AsyncSession):
        new_generation_upload = Generations(
            user_id = createGenerationDTO["user_id"],
            file_path = createGenerationDTO["file_path"],
            uploaded_file_path = createGenerationDTO["uploaded_file_path"]
        )

        db.add(new_generation_upload)
        await db.commit()
        await db.refresh(new_generation_upload)
        return {"status": "Success", "upload_id": new_generation_upload.id}
    
    # TODO: Add the generation path as well for now still using the upload path
    async def save_upload_and_generation(self, user_id: uuid.UUID, save_path: str, db: AsyncSession):
        try:
            # Save upload
            upload_schema = {"user_id":user_id, "file_path": save_path}
            upload_response = await self.add_upload(upload_schema, db)
            upload_id = upload_response["upload_id"]

            # Save generation
            generation_schema = {
                "user_id":user_id,
                "file_path": "test " + save_path,
                "uploaded_file_path": upload_id
            }
            generation_response = await self.add_generation(generation_schema, db)

            return {
                "status": "Success",
                "upload_id": upload_id,
                "generation_id": generation_response["upload_id"]
            }
        except Exception as e:
            return {"status": "Error", "message": str(e)}

    
def get_generation_service():
    return GenerationService()