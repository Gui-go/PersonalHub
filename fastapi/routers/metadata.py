from fastapi import APIRouter, HTTPException
from config import client, PROJECT_ID
from models import TableSchema, SchemaField

router = APIRouter()

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
        return {"tables": [table.table_id for table in tables]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list tables: {str(e)}")

@router.get("/schema/{dataset}/{table}")
async def get_table_schema(dataset: str, table: str):
    try:
        full_table = f"{PROJECT_ID}.{dataset}.{table}"
        table_ref = client.get_table(full_table)
        schema = [
            SchemaField(
                name=field.name,
                type=field.field_type,
                mode=field.mode,
                description=field.description
            )
            for field in table_ref.schema
        ]
        return TableSchema(fields=schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch schema: {str(e)}")


