"""
Pay&Plag FastAPI Backend
Handles: Plagiarism Detection, AI Content Detection, AI Paraphrasing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os, logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("payplag")

app = FastAPI(
    title="Pay&Plag AI Backend",
    description="AI-powered plagiarism detection, AI content detection, and paraphrasing.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://payplag.in"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import plagiarism, detect, paraphrase
app.include_router(plagiarism.router, prefix="/api")
app.include_router(detect.router, prefix="/api")
app.include_router(paraphrase.router, prefix="/api")


@app.get("/")
def root():
    return {"service": "Pay&Plag AI Backend", "status": "operational", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
