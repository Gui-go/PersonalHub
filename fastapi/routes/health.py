from fastapi import APIRouter, HTTPException
from datetime import datetime
from config import client
from models import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse, summary="Check API health", description="Verify the API is running and can connect to BigQuery.")
async def health_check():
    try:
        client.get_service_account_email()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
