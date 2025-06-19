from pydantic import BaseModel
from typing import List, Optional

class FilterCondition(BaseModel):
    column: str
    operator: str
    value: str

class QueryParams(BaseModel):
    columns: Optional[List[str]] = None
    filters: Optional[List[FilterCondition]] = None
    limit: Optional[int] = None
    group_by: Optional[List[str]] = None
    order_by: Optional[str] = None
    order_direction: Optional[str] = "ASC"

class HealthResponse(BaseModel):
    status: str
    timestamp: str
