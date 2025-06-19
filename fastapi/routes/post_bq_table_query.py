from fastapi import APIRouter, HTTPException
from config import client, PROJECT_ID
from models import QueryParams
from utils import build_sql_query

router = APIRouter()

@router.post(
    "/query/{dataset}/{table}", 
    summary="Query table with custom parameters", 
    description="Execute a custom query with selectable columns, filters, grouping, and ordering."
)
async def post_bq_table_query(dataset: str, table: str, params: QueryParams):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = build_sql_query(full_table, params)
        query_job = client.query(query)
        return {"results": [dict(row) for row in query_job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
