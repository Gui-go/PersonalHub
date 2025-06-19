from fastapi import APIRouter, HTTPException
from typing import Optional
from config import client, PROJECT_ID

router = APIRouter()

@router.get("/fetch/{dataset}/{table}", summary="Fetch data table", description="Retrieve data from a specific BigQuery table with optional limit parameter.")
async def fetch_table(dataset: str, table: str, limit: Optional[int] = None):
    if limit is not None and limit < 1:
        raise HTTPException(status_code=400, detail="Limit must be at least 1")
    
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = f"SELECT * FROM `{full_table}`"
        if limit is not None:
            query += f" LIMIT {limit}"
        query_job = client.query(query)
        return {"results": [dict(row) for row in query_job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
