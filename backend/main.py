# External Imports
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Internal Imports
from src.modules.root.root_controller import router as root_router
from src.modules.user.user_controller import router as user_router
from src.modules.auth.auth_controller import router as auth_router
from src.modules.generator.generator_controller import router as generator_router
from src.modules.chat.chat_controller import router as chat_router


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
app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(generator_router, prefix="/api/generator", tags=["Generator"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
