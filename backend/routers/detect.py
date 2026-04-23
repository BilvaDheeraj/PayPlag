"""
AI Content Detection Router
Uses Anthropic's Claude 3.5 Sonnet to accurately classify text as AI or Human.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os, json, logging, re
import anthropic

router = APIRouter()
logger = logging.getLogger("payplag.detect")

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")

class DetectRequest(BaseModel):
    text: str

def split_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if len(s.strip().split()) >= 3]

@router.post("/detect")
async def detect_ai(req: DetectRequest):
    text = req.text.strip()
    if len(text.split()) < 20:
        raise HTTPException(status_code=400, detail="Minimum 20 words required")

    sentences = split_sentences(text)
    if not sentences:
        raise HTTPException(status_code=400, detail="Could not parse sentences")

    if not ANTHROPIC_KEY:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")

    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
        
        system_prompt = """You are an advanced AI detection system. 
Analyze the provided text to determine if it was written by an AI or a Human.
Return the result as a strict JSON object with the following structure:
{
  "overallScore": <float 0-100, where 100 is definitely AI and 0 is definitely Human>,
  "sentences": [
    {
      "sentence": "<exact sentence from text>",
      "score": <float 0-100, AI probability>,
      "label": "<either 'AI' or 'Human'>"
    }
  ]
}
Do not output any markdown formatting like ```json. Output raw JSON only. Ensure the sentences in the JSON exactly match the original text sentences. Analyze each sentence individually.
"""
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            temperature=0.0,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"Analyze this text:\n\n{text}"
                }
            ],
        )

        response_text = message.content[0].text.strip()
        # Clean up if claude outputs markdown
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        try:
            analysis = json.loads(response_text)
        except json.JSONDecodeError:
            logger.error(f"Failed to parse Claude JSON: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to parse AI detection results")

        overall_score = float(analysis.get("overallScore", 0))
        
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

        # Construct sentences mapping
        sentence_results = []
        parsed_sentences = analysis.get("sentences", [])
        
        # We need to map Claude's output to our sentences or just use Claude's directly
        for s in parsed_sentences:
            sentence_results.append({
                "sentence": s.get("sentence", ""),
                "aiProbability": float(s.get("score", 0)),
                "label": s.get("label", "Human")
            })

        return {
            "overallScore": round(overall_score, 1),
            "verdict": verdict,
            "confidence": confidence,
            "perplexity": 0, # Legacy field, can be 0
            "burstiness": 0, # Legacy field, can be 0
            "sentences": sentence_results,
        }

    except anthropic.APIError as e:
        logger.error(f"Anthropic API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail="AI detection failed")
