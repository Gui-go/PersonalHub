from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

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

class InsertData(BaseModel):
    data: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    timestamp: str

class SchemaField(BaseModel):
    name: str
    type: str
    mode: Optional[str] = None
    description: Optional[str] = None

class TableSchema(BaseModel):
    fields: List[SchemaField]