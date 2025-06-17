import os
# import logging
from fastapi import FastAPI, HTTPException, Request
from google.cloud import bigquery
# from google.cloud.exceptions import NotFound
# from google.oauth2 import service_account
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
# import uuid
# from shapely.wkt import loads as wkt_loads
# from shapely.geometry import mapping
# import geojson

version_release="1.0.3"
app = FastAPI(title="BigQuery API", version=version_release)

# Configuration
PROJECT_ID = "personalhub13"
from google.cloud import bigquery
client = bigquery.Client(project=PROJECT_ID)


# Pydantic models
class FilterCondition(BaseModel):
    column: str
    operator: str
    value: str

class QueryParams(BaseModel):
    columns: Optional[List[str]] = None
    filters: Optional[List[FilterCondition]] = None
    limit: Optional[int] = 100
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
    
    # Limit clause
    if params.limit and (params.limit < 1 or params.limit > 1000):
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 1000")
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
    """
    Call: GET /health
    Example: GET /health
    Returns: JSON object with health status and timestamp
    """
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
async def fetch_table(dataset: str, table: str, limit: Optional[int] = 100):
    """
    Call: GET /fetch/{dataset}/{table}?limit={number}
    Example: GET /fetch/my_dataset/my_table?limit=50
    Parameters:
        - dataset: The BigQuery dataset name
        - table: The BigQuery table name
        - limit: Maximum number of rows to return (1-1000)
    Returns: JSON array of row objects
    """
    if limit < 1 or limit > 1000:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 1000")
    
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        query = f"SELECT * FROM `{full_table}` LIMIT {limit}"
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
    """
    Call: POST /query/{dataset}/{table}
    Example: POST /query/my_dataset/my_table
    Body: {
        "columns": ["col1", "col2"],
        "filters": [{"column": "age", "operator": ">", "value": "25"}],
        "limit": 100,
        "group_by": ["col1"],
        "order_by": "col1",
        "order_direction": "DESC"
    }
    Parameters:
        - dataset: The BigQuery dataset name
        - table: The BigQuery table name
        - params: JSON object with query parameters
    Returns: JSON array of row objects
    """
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
    """
    Call: GET /columns/{dataset}/{table}
    Example: GET /columns/my_dataset/my_table
    Parameters:
        - dataset: The BigQuery dataset name
        - table: The BigQuery table name
    Returns: JSON object with array of column names
    """
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
    """
    Call: GET /tables/{dataset}
    Example: GET /tables/my_dataset
    Parameters:
        - dataset: The BigQuery dataset name
    Returns: JSON object with array of table names
    """
    try:
        dataset_ref = client.dataset(dataset)
        tables = client.list_tables(dataset_ref)
        return {"tables": [table.table_id for table in tables]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")




