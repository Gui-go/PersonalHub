from fastapi import APIRouter, HTTPException
from config import client, PROJECT_ID

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

