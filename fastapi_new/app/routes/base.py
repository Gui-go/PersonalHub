from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.client import client
from app.models import HealthResponse

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "FastAPI BigQuery Service"}

@router.get("/health", response_model=HealthResponse)
async def health_check():
    try:
        client.get_service_account_email()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
