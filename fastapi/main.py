from fastapi import FastAPI
from google.cloud import bigquery
import os

app = FastAPI()

# Initialize BigQuery client
project_id = os.getenv("PROJECT_ID")
client = bigquery.Client(project=project_id)

@app.get("/query")
async def run_query():
    query = """
    SELECT *
    FROM `database.df_locations`
    LIMIT 10
    """
    query_job = client.query(query)
    results = query_job.result()
    
    # Convert results to list of dicts
    data = [dict(row) for row in results]
    return {"results": data}

@app.get("/")
async def root():
    return {"message": "FastAPI BigQuery Service"}


# 
#  from fastapi import FastAPI, HTTPException
# from google.cloud import bigquery
# from pydantic import BaseModel
# import os
# from typing import List, Optional, Dict
# from urllib.parse import unquote

# app = FastAPI()

# # Initialize BigQuery client
# # project_id = os.getenv("PROJECT_ID")
# project_id = "personalhub3"
# if not project_id:
#     raise ValueError("PROJECT_ID environment variable not set")
# client = bigquery.Client(project=project_id)

# # Pydantic models for request validation
# class FilterCondition(BaseModel):
#     column: str
#     operator: str  # e.g., "=", ">", "<", ">=", "<=", "!=", "LIKE"
#     value: str

# class QueryParams(BaseModel):
#     columns: Optional[List[str]] = None
#     filters: Optional[List[FilterCondition]] = None
#     limit: Optional[int] = 100
#     group_by: Optional[List[str]] = None
#     order_by: Optional[str] = None
#     order_direction: Optional[str] = "ASC"

# # Helper function to build SQL query
# def build_sql_query(table: str, params: QueryParams) -> str:
#     # Sanitize table name (basic validation)
#     if not table.replace(".", "").replace("_", "").isalnum():
#         raise HTTPException(status_code=400, detail="Invalid table name")

#     # Start building the query
#     query_parts = []
    
#     # Select clause
#     if params.columns:
#         columns = ", ".join([f"`{col}`" for col in params.columns])
#     else:
#         columns = "*"
#     query_parts.append(f"SELECT {columns}")
    
#     # From clause
#     query_parts.append(f"FROM `{table}`")
    
#     # Where clause
#     if params.filters:
#         where_conditions = []
#         for filter in params.filters:
#             # Basic SQL injection prevention
#             if not filter.column.replace("_", "").isalnum():
#                 raise HTTPException(status_code=400, detail="Invalid column name")
#             if filter.operator not in ["=", ">", "<", ">=", "<=", "!=", "LIKE"]:
#                 raise HTTPException(status_code=400, detail="Invalid operator")
            
#             # Handle string values and LIKE operator
#             if filter.operator == "LIKE" or filter.value.startswith("'"):
#                 value = f"'{filter.value}'"
#             else:
#                 value = filter.value
#             where_conditions.append(f"`{filter.column}` {filter.operator} {value}")
#         query_parts.append("WHERE " + " AND ".join(where_conditions))
    
#     # Group by clause
#     if params.group_by:
#         group_columns = ", ".join([f"`{col}`" for col in params.group_by])
#         query_parts.append(f"GROUP BY {group_columns}")
    
#     # Order by clause
#     if params.order_by:
#         if not params.order_by.replace("_", "").isalnum():
#             raise HTTPException(status_code=400, detail="Invalid order_by column")
#         order_direction = "ASC" if params.order_direction.upper() == "ASC" else "DESC"
#         query_parts.append(f"ORDER BY `{params.order_by}` {order_direction}")
    
#     # Limit clause
#     if params.limit:
#         if params.limit < 1 or params.limit > 1000:  # Reasonable limit range
#             raise HTTPException(status_code=400, detail="Limit must be between 1 and 1000")
#         query_parts.append(f"LIMIT {params.limit}")
    
#     return " ".join(query_parts)

# @app.get("/")
# async def root():
#     return {"message": "FastAPI BigQuery Service"}

# @app.get("/tables/{dataset}/{table}")
# async def get_table_data(dataset: str, table: str, limit: Optional[int] = 100):
#     """
#     Fetch data from a specific table with optional limit.
#     Example: /tables/database/df_locations?limit=10
#     """
#     try:
#         full_table = f"{project_id}.{dataset}.{table}"
#         query = f"SELECT * FROM `{full_table}` LIMIT {limit}"
#         query_job = client.query(query)
#         results = query_job.result()
#         data = [dict(row) for row in results]
#         return {"results": data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/tables/{dataset}/{table}/query")
# async def query_table(dataset: str, table: str, params: QueryParams):
#     """
#     Query table with custom columns, filters, grouping, and ordering.
#     Example: /tables/database/df_locations/query
#     Body: {
#         "columns": ["column1", "column2"],
#         "filters": [{"column": "age", "operator": ">", "value": "25"}],
#         "limit": 100,
#         "group_by": ["column1"],
#         "order_by": "column1",
#         "order_direction": "DESC"
#     }
#     """
#     try:
#         full_table = f"{project_id}.{dataset}.{table}"
#         query = build_sql_query(full_table, params)
#         query_job = client.query(query)
#         results = query_job.result()
#         data = [dict(row) for row in results]
#         return {"results": data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/tables/{dataset}/{table}/columns")
# async def get_table_columns(dataset: str, table: str):
#     """
#     Get available columns for a specific table.
#     Example: /tables/database/df_locations/columns
#     """
#     try:
#         full_table = f"{project_id}.{dataset}.{table}"
#         table_ref = client.get_table(full_table)
#         columns = [field.name for field in table_ref.schema]
#         return {"columns": columns}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/tables/{dataset}")
# async def list_tables(dataset: str):
#     """
#     List all tables in a dataset.
#     Example: /tables/database
#     """
#     try:
#         dataset_ref = client.dataset(dataset)
#         tables = client.list_tables(dataset_ref)
#         table_names = [table.table_id for table in tables]
#         return {"tables": table_names}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))