from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.business_router import router as business_router
from router.user_router import router as service_router
from router.twilio_router import router as twilio_router
from utilities.startup import startup_utilities

import uvicorn

app = FastAPI()
app.include_router(router=service_router)
app.include_router(router=business_router)
app.include_router(router=twilio_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_utilities.get_vector_database_client()

    yield

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, access_log=True)