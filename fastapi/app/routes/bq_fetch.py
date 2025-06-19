from fastapi import APIRouter, HTTPException
from typing import Optional
from app.client import client
from app.models import QueryParams
from app.utils import build_sql_query
from app.config import PROJECT_ID

router = APIRouter()

@router.get("/fetch/{dataset}/{table}")
async def fetch_table(dataset: str, table: str, limit: Optional[int] = None):
    if limit is not None and limit < 1:
        raise HTTPException(status_code=400, detail="Limit must be at least 1")
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = f"SELECT * FROM `{full_table}`"
        if limit:
            query += f" LIMIT {limit}"
        job = client.query(query)
        return {"results": [dict(row) for row in job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.post("/query/{dataset}/{table}")
async def query_table(dataset: str, table: str, params: QueryParams):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = build_sql_query(full_table, params)
        job = client.query(query)
        return {"results": [dict(row) for row in job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/columns/{dataset}/{table}")
async def get_table_columns(dataset: str, table: str):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        table_ref = client.get_table(full_table)
        return {"columns": [field.name for field in table_ref.schema]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch columns: {str(e)}")

@router.get("/tables/{dataset}")
async def list_tables(dataset: str):
    try:
        dataset_ref = client.dataset(dataset)
        tables = client.list_tables(dataset_ref)
        return {"tables": [t.table_id for t in tables]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")
