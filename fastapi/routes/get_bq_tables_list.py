from fastapi import APIRouter, HTTPException
from config import client, PROJECT_ID

router = APIRouter()

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
