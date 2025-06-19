from fastapi import HTTPException
from typing import Optional
from models import QueryParams

def build_sql_query(table: str, params: QueryParams) -> str:
    if not table.replace(".", "").replace("_", "").isalnum():
        raise HTTPException(status_code=400, detail="Invalid table name")

    query_parts = []
    columns = ", ".join([f"`{col}`" for col in params.columns]) if params.columns else "*"
    query_parts.append(f"SELECT {columns}")
    query_parts.append(f"FROM `{table}`")

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

    if params.group_by:
        query_parts.append(f"GROUP BY {', '.join([f'`{col}`' for col in params.group_by])}")

    if params.order_by:
        if not params.order_by.replace("_", "").isalnum():
            raise HTTPException(status_code=400, detail="Invalid order_by column")
        order_dir = "ASC" if params.order_direction.upper() == "ASC" else "DESC"
        query_parts.append(f"ORDER BY `{params.order_by}` {order_dir}")

    if params.limit is not None:
        if params.limit < 1:
            raise HTTPException(status_code=400, detail="Limit must be at least 1")
        query_parts.append(f"LIMIT {params.limit}")

    return " ".join(query_parts)
