from fastapi import FastAPI
from routes import health, fetch, query, metadata

version_release = "1.1.2"
app = FastAPI(title="Guigo's API", version=version_release)

app.include_router(health.router)
app.include_router(fetch.router)
app.include_router(query.router)
app.include_router(metadata.router)

@app.get("/")
async def root():
    return {"message": f"Guigo's FastAPI Service (version {version_release})"}
