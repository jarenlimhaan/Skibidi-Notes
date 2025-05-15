# External Imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Internal Imports 
from src.modules.root.root_controller import router as root_router
from src.modules.user.user_controller import router as user_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for CORS
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

## Include routers
app.include_router(root_router)
app.include_router(user_router,prefix="/users", tags=["Users"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)