from pydantic import BaseModel, field_validator


class AnalyzeRequest(BaseModel):
    text: str

    @field_validator('text')
    @classmethod
    def text_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Text must not be empty')
        return v.strip()


class AnalyzeResponse(BaseModel):
    sentiment: str  # "positive", "neutral", "negative"
    compound_score: float
    pos: float
    neg: float
    neu: float


class HealthResponse(BaseModel):
    status: str
    service: str
