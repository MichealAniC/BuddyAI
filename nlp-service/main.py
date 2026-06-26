import os
import nltk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AnalyzeRequest, AnalyzeResponse, HealthResponse
from nlp.processor import TextProcessor
from nlp.analyzer import SentimentAnalyzer

# Download required NLTK data on startup
nltk_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
os.makedirs(nltk_data_path, exist_ok=True)
nltk.data.path.append(nltk_data_path)

# Clean up any partial downloads from previous runs
import glob as _glob
for zip_file in _glob.glob(os.path.join(nltk_data_path, '**', '*.zip'), recursive=True):
    try:
        os.remove(zip_file)
    except OSError:
        pass

for resource in ['punkt_tab', 'stopwords', 'vader_lexicon']:
    try:
        nltk.download(resource, download_dir=nltk_data_path, quiet=True)
    except Exception as e:
        print(f"Warning: Failed to download {resource}: {e}")

app = FastAPI(title="BuddyAI NLP Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NLP components
processor = TextProcessor()
analyzer = SentimentAnalyzer()


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """Analyze text for sentiment using VADER."""
    try:
        # Preprocess text
        processed_text = processor.preprocess(request.text)

        # If preprocessing removes everything, analyze original
        if not processed_text:
            processed_text = request.text.lower()

        # Perform sentiment analysis
        result = analyzer.analyze(processed_text)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="healthy", service="nlp-service")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("NLP_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
