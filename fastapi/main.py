from fastapi import FastAPI
from routes import get_bq_table_columns, get_bq_tables_list, get_bq_table_fetch, get_health_check
from routes import post_bq_table_query

version_release = "1.1.3"
app = FastAPI(title="Guigo's API", version=version_release)

app.include_router(get_health_check.router)
app.include_router(get_bq_table_fetch.router)
app.include_router(get_bq_table_columns.router)
app.include_router(get_bq_tables_list.router)
app.include_router(post_bq_table_query.router)

@app.get("/")
async def root():
    return {"message": f"Guigo's FastAPI Service (version {version_release})"}
