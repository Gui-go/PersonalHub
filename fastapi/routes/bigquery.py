from fastapi import APIRouter, HTTPException
from typing import Optional
from config import client, PROJECT_ID
from models import QueryParams
from utils import build_sql_query

router = APIRouter()


@router.get(
    "/columns/{dataset}/{table}", 
    summary="List table columns", 
    description="Retrieve all column names for a specific BigQuery table."
)
async def get_bq_table_columns(dataset: str, table: str):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        table_ref = client.get_table(full_table)
        return {"columns": [field.name for field in table_ref.schema]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch columns: {str(e)}")


@router.get(
    "/fetch/{dataset}/{table}", 
    summary="Fetch data table", 
    description="Retrieve data from a specific BigQuery table with optional limit parameter."
)
async def get_bq_table_fetch(dataset: str, table: str, limit: Optional[int] = None):
    """
    Call: GET /fetch/{dataset}/{table}?limit={number}
    Example: GET /fetch/my_dataset/my_table?limit=50
    Parameters:
        - dataset: The BigQuery dataset name
        - table: The BigQuery table name
        - limit: Maximum number of rows to return (optional, positive integer)
    Returns: JSON array of row objects
    """
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


@router.get(
    "/tables/{dataset}", 
    summary="List tables in dataset", 
    description="Retrieve all table names in a specific BigQuery dataset."
)
async def get_bq_tables_list(dataset: str):
    try:
        dataset_ref = client.dataset(dataset)
        tables = client.list_tables(dataset_ref)
        return {"tables": [table.table_id for table in tables]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")


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




