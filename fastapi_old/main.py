import os
from fastapi import FastAPI, HTTPException, Request
from google.cloud import bigquery
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

version_release = "1.0.3"
app = FastAPI(title="BigQuery API", version=version_release)

# Configuration
PROJECT_ID = "personalhub13"
client = bigquery.Client(project=PROJECT_ID)

# Pydantic models
class FilterCondition(BaseModel):
    column: str
    operator: str
    value: str

class QueryParams(BaseModel):
    columns: Optional[List[str]] = None
    filters: Optional[List[FilterCondition]] = None
    limit: Optional[int] = None  # Changed default to None
    group_by: Optional[List[str]] = None
    order_by: Optional[str] = None
    order_direction: Optional[str] = "ASC"

class HealthResponse(BaseModel):
    status: str
    timestamp: str

# Helper function to build SQL query
def build_sql_query(table: str, params: QueryParams) -> str:
    # Validate table name
    if not table.replace(".", "").replace("_", "").isalnum():
        raise HTTPException(status_code=400, detail="Invalid table name")

    query_parts = []
    
    # Select clause
    columns = ", ".join([f"`{col}`" for col in params.columns]) if params.columns else "*"
    query_parts.append(f"SELECT {columns}")
    
    # From clause
    query_parts.append(f"FROM `{table}`")
    
    # Where clause
    if params.filters:
        valid_operators = {"=", ">", "<", ">=", "<=", "!=", "LIKE"}
        where_conditions = []
        for f in params.filters:
            if not f.column.replace("_", "").isalnum():
                raise HTTPException(status_code=400, detail=f"Invalid column name: {f.column}")
            if f.operator not in valid_operators:
                raise HTTPException(status_code=400, detail=f"Invalid operator: {f.operator}")
            
            value = f"'{f.value}'" if f.operator == "LIKE" or isinstance(f.value, str) else f.value
            where_conditions.append(f"`{f.column}` {f.operator} {value}")
        query_parts.append("WHERE " + " AND ".join(where_conditions))
    
    # Group by clause
    if params.group_by:
        query_parts.append(f"GROUP BY {', '.join([f'`{col}`' for col in params.group_by])}")
    
    # Order by clause
    if params.order_by:
        if not params.order_by.replace("_", "").isalnum():
            raise HTTPException(status_code=400, detail="Invalid order_by column")
        order_dir = "ASC" if params.order_direction.upper() == "ASC" else "DESC"
        query_parts.append(f"ORDER BY `{params.order_by}` {order_dir}")
    
    # Limit clause (only if provided)
    if params.limit is not None:
        if params.limit < 1:
            raise HTTPException(status_code=400, detail="Limit must be at least 1")
        query_parts.append(f"LIMIT {params.limit}")
    
    return " ".join(query_parts)

@app.get("/")
async def root():
    return {"message": f"FastAPI BigQuery Service ({version_release})"}

@app.get(
    "/health",
    summary="Check API health",
    description="Verify the API is running and can connect to BigQuery.",
    response_model=HealthResponse
)
async def health_check():
    try:
        client.get_service_account_email()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@app.get(
    "/fetch/{dataset}/{table}",
    summary="Fetch data table",
    description="Retrieve data from a specific BigQuery table with optional limit parameter."
)
async def fetch_table(dataset: str, table: str, limit: Optional[int] = None):
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

@app.post(
    "/query/{dataset}/{table}",
    summary="Query table with custom parameters",
    description="Execute a custom query with selectable columns, filters, grouping, and ordering."
)
async def query_table(dataset: str, table: str, params: QueryParams):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = build_sql_query(full_table, params)
        query_job = client.query(query)
        return {"results": [dict(row) for row in query_job.result()]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@app.get(
    "/columns/{dataset}/{table}",
    summary="List table columns",
    description="Retrieve all column names for a specific BigQuery table."
)
async def get_table_columns(dataset: str, table: str):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        table_ref = client.get_table(full_table)
        return {"columns": [field.name for field in table_ref.schema]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch columns: {str(e)}")

@app.get(
    "/tables/{dataset}",
    summary="List tables in dataset",
    description="Retrieve all table names in a specific BigQuery dataset."
)
async def list_tables(dataset: str):
    try:
        dataset_ref = client.dataset(dataset)
        tables = client.list_tables(dataset_ref)
        return {"tables": [table.table_id for table in tables]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")