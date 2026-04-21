"""
AI Paraphrasing Router
Uses Claude via Anthropic API for high-quality paraphrasing in 5 modes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, logging, anthropic
from difflib import SequenceMatcher

router = APIRouter()
logger = logging.getLogger("payplag.paraphrase")

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")

MODE_PROMPTS = {
    "standard": "Rewrite the following text naturally. Keep the same meaning but use different words and sentence structures.",
    "fluent": "Rewrite the following text to make it flow smoothly and sound natural. Improve readability while preserving the original meaning.",
    "academic": "Rewrite the following text in a formal academic style suitable for research papers and scholarly work. Maintain technical accuracy and precision.",
    "simple": "Rewrite the following text in simple, easy-to-understand language. Use short sentences and common words that anyone can understand.",
    "creative": "Rewrite the following text in a creative, expressive, and engaging style. Make it vivid and interesting while keeping the core meaning.",
}


class ParaphraseRequest(BaseModel):
    text: str
    mode: str = "standard"


def compute_similarity(a: str, b: str) -> float:
    return round(SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100, 1)


@router.post("/paraphrase")
async def paraphrase_text(req: ParaphraseRequest):
    text = req.text.strip()
    mode = req.mode if req.mode in MODE_PROMPTS else "standard"

    if len(text.split()) < 10:
        raise HTTPException(status_code=400, detail="Minimum 10 words required")

    if len(text.split()) > 10000:
        raise HTTPException(status_code=400, detail="Maximum 10,000 words allowed")

    if not ANTHROPIC_KEY:
        # Fallback demo mode
        rewritten = f"[Demo] {text}"
        return {"original": text, "rewritten": rewritten, "similarity": 80.0, "mode": mode}

    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
        system_prompt = MODE_PROMPTS[mode]

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": f"{system_prompt}\n\nText to rewrite:\n\n{text}\n\nProvide ONLY the rewritten text. No explanations, no preamble.",
                }
            ],
        )

        rewritten = message.content[0].text.strip()
        similarity = compute_similarity(text, rewritten)

        return {
            "original": text,
            "rewritten": rewritten,
            "similarity": similarity,
            "mode": mode,
            "wordCount": len(rewritten.split()),
        }

    except anthropic.APIError as e:
        logger.error(f"Anthropic API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Paraphrase error: {e}")
        raise HTTPException(status_code=500, detail="Paraphrasing failed")
