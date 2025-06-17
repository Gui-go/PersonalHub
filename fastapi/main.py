from fastapi import FastAPI
from routers import query, metadata

version_release = "1.1.0"
app = FastAPI(title="BigQuery API", version=version_release)

app.include_router(query.router, prefix="/api/v1")
app.include_router(metadata.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": f"FastAPI BigQuery Service ({version_release})"}

