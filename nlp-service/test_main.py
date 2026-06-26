import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "nlp-service"


class TestAnalyzeEndpoint:
    def test_positive_sentiment(self):
        response = client.post("/analyze", json={"text": "I am so happy and excited today!"})
        assert response.status_code == 200
        data = response.json()
        assert data["sentiment"] == "positive"
        assert data["compound_score"] > 0.05

    def test_negative_sentiment(self):
        response = client.post("/analyze", json={"text": "I feel terrible and hopeless"})
        assert response.status_code == 200
        data = response.json()
        assert data["sentiment"] == "negative"
        assert data["compound_score"] < -0.05

    def test_neutral_sentiment(self):
        response = client.post("/analyze", json={"text": "The weather is okay today"})
        assert response.status_code == 200
        data = response.json()
        assert data["sentiment"] in ["neutral", "positive"]  # "okay" might lean slightly positive
        assert "compound_score" in data

    def test_empty_text_validation(self):
        response = client.post("/analyze", json={"text": ""})
        assert response.status_code == 422

    def test_missing_text_field(self):
        response = client.post("/analyze", json={})
        assert response.status_code == 422

    def test_response_has_all_fields(self):
        response = client.post("/analyze", json={"text": "This is a test message"})
        assert response.status_code == 200
        data = response.json()
        assert "sentiment" in data
        assert "compound_score" in data
        assert "pos" in data
        assert "neg" in data
        assert "neu" in data
