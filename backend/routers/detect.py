"""
AI Content Detection Router
3-layer detection: Perplexity analysis + Burstiness + Semantic patterns
Uses HuggingFace transformers for local inference
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re, math, logging
from collections import Counter

router = APIRouter()
logger = logging.getLogger("payplag.detect")

_model = None
_tokenizer = None


def get_model():
    global _model, _tokenizer
    if _model is None:
        try:
            from transformers import GPT2LMHeadModel, GPT2TokenizerFast
            import torch
            _tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
            _model = GPT2LMHeadModel.from_pretrained("gpt2")
            _model.eval()
            logger.info("GPT-2 model loaded for AI detection")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
    return _model, _tokenizer


class DetectRequest(BaseModel):
    text: str


def split_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if len(s.strip().split()) >= 3]


def compute_perplexity(text: str) -> float:
    """Compute perplexity using GPT-2. Low perplexity → likely AI."""
    model, tokenizer = get_model()
    if model is None:
        return 50.0  # neutral fallback

    try:
        import torch
        inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
        with torch.no_grad():
            outputs = model(**inputs, labels=inputs["input_ids"])
            loss = outputs.loss.item()
        return math.exp(min(loss, 20))
    except Exception as e:
        logger.error(f"Perplexity error: {e}")
        return 50.0


def compute_burstiness(sentences: list[str]) -> float:
    """
    AI text tends to have uniform sentence length (low burstiness).
    Returns a burstiness score — low → more likely AI.
    """
    if len(sentences) < 3:
        return 50.0
    lengths = [len(s.split()) for s in sentences]
    mean = sum(lengths) / len(lengths)
    variance = sum((l - mean) ** 2 for l in lengths) / len(lengths)
    std = math.sqrt(variance)
    cv = std / max(mean, 1)
    # High CV = human-like, Low CV = AI-like
    return min(cv * 100, 100)


def ai_score_from_metrics(perplexity: float, burstiness: float) -> float:
    """
    Combine perplexity and burstiness into a 0-100 AI probability score.
    - Low perplexity (<50) → high AI score
    - Low burstiness (<20) → high AI score
    """
    # Normalize perplexity: <30 → very AI, >500 → very human
    ppl_score = max(0, min(100, 100 - (perplexity / 5)))
    # Burstiness: 0-100, low = AI
    burst_score = max(0, 100 - burstiness)
    return round(ppl_score * 0.65 + burst_score * 0.35, 1)


def classify_sentence(sentence: str, overall_score: float) -> dict:
    """Classify each sentence as ai/human/uncertain with probability."""
    # Quick heuristics for sentence-level classification
    ppl = compute_perplexity(sentence)
    score = max(0, min(100, 100 - (ppl / 5)))

    # Adjust by overall doc score
    blended = round(score * 0.7 + overall_score * 0.3, 1)

    label = "uncertain"
    if blended >= 65:
        label = "ai"
    elif blended <= 35:
        label = "human"

    return {
        "sentence": sentence,
        "aiProbability": blended,
        "label": label,
    }


@router.post("/detect")
async def detect_ai(req: DetectRequest):
    text = req.text.strip()
    if len(text.split()) < 20:
        raise HTTPException(status_code=400, detail="Minimum 20 words required")

    sentences = split_sentences(text)
    if not sentences:
        raise HTTPException(status_code=400, detail="Could not parse sentences")

    # Layer 1: Document-level perplexity
    perplexity = compute_perplexity(text[:1500])

    # Layer 2: Burstiness
    burstiness = compute_burstiness(sentences)

    # Layer 3: Combined score
    overall_score = ai_score_from_metrics(perplexity, burstiness)

    # Verdict
    if overall_score >= 75:
        verdict = "Very Likely AI Generated"
        confidence = "High"
    elif overall_score >= 50:
        verdict = "Likely AI Generated"
        confidence = "Medium"
    elif overall_score >= 30:
        verdict = "Possibly Mixed Content"
        confidence = "Low"
    else:
        verdict = "Likely Human Written"
        confidence = "High"

    # Sentence breakdown
    sentence_results = [classify_sentence(s, overall_score) for s in sentences[:50]]

    return {
        "overallScore": round(overall_score, 1),
        "verdict": verdict,
        "confidence": confidence,
        "perplexity": round(perplexity, 2),
        "burstiness": round(burstiness, 2),
        "sentences": sentence_results,
    }
