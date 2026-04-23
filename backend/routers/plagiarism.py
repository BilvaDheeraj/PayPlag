"""
Plagiarism Detection Router
Checks text against web using DuckDuckGo Search API + cosine similarity scoring
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, re, asyncio, logging
from difflib import SequenceMatcher
from ddgs import DDGS

router = APIRouter()
logger = logging.getLogger("payplag.plagiarism")

class PlagiarismRequest(BaseModel):
    text: str

def split_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if len(s.strip().split()) >= 5]

def similarity_ratio(a: str, b: str) -> float:
    return round(SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100, 1)

def search_ddg(query: str, max_results=3):
    try:
        ddgs = DDGS()
        return ddgs.text(query, max_results=max_results)
    except Exception as e:
        logger.error(f"DDG search error: {e}")
        return []

async def check_sentence(sentence: str) -> dict:
    # Run the synchronous DDGS search in a thread to avoid blocking the event loop
    results = await asyncio.to_thread(search_ddg, f'"{sentence}"', 3)
    
    sources = []
    if results:
        for r in results:
            sim = similarity_ratio(sentence, r.get("body", ""))
            if sim > 25:
                sources.append({
                    "url": r.get("href", ""),
                    "title": r.get("title", "Unknown Source"),
                    "similarity": sim,
                })

    sources.sort(key=lambda x: x["similarity"], reverse=True)
    return {"sentence": sentence, "sources": sources}


@router.post("/plagiarism")
async def check_plagiarism(req: PlagiarismRequest):
    text = req.text.strip()
    words = text.split()
    word_count = len(words)

    if word_count < 20:
        raise HTTPException(status_code=400, detail="Minimum 20 words required")

    sentences = split_sentences(text)

    # DDGS has rate limits, we should process in small batches or with slight delays
    # We'll limit to checking 15 sentences maximum to avoid rate limiting
    target_sentences = sentences[:15]
    
    # Process concurrently
    tasks = [check_sentence(s) for s in target_sentences]
    matches_raw = await asyncio.gather(*tasks)

    matches = [m for m in matches_raw if m["sources"]]

    # Calculate plagiarism score
    plagiarized_sentences = len(matches)
    total_sentences = len(target_sentences)
    overall_score = round((plagiarized_sentences / max(total_sentences, 1)) * 100, 1)

    # Estimate plagiarized words
    avg_words_per_sentence = word_count / max(len(sentences), 1)
    plagiarized_words = round(plagiarized_sentences * avg_words_per_sentence)

    return {
        "overallScore": min(overall_score, 100),
        "uniqueScore": round(100 - overall_score, 1),
        "wordCount": word_count,
        "plagiarizedWords": plagiarized_words,
        "matches": matches,
    }
