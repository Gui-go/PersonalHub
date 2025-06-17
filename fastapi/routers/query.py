from fastapi.routers import APIRouter, HTTPException
from datetime import datetime
from config import client, PROJECT_ID
from models import QueryParams, HealthResponse, InsertData
from utils import build_sql_query

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    try:
        client.get_service_account_email()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@router.get("/fetch/{dataset}/{table}")
async def fetch_table(dataset: str, table: str, limit: int = 100):
    if limit < 1 or limit > 1000:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 1000")
    
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = f"SELECT * FROM `{full_table}` LIMIT {limit}"
        query_job = client.query(query)
        return {"results": [dict(row) for row in query_job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.post("/query/{dataset}/{table}")
async def query_table(dataset: str, table: str, params: QueryParams):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = build_sql_query(full_table, params)
        query_job = client.query(query)
        return {"results": [dict(row) for row in query_job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.post("/insert/{dataset}/{table}")
async def insert_data(dataset: str, table: str, insert_data: InsertData):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        table_ref = client.get_table(full_table)
        
        errors = client.insert_rows_json(table_ref, insert_data.data)
        if errors:
            raise HTTPException(status_code=400, detail=f"Insert errors: {errors}")
        return {"status": "success", "inserted_rows": len(insert_data.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insert failed: {str(e)}")