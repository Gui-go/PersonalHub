from fastapi import FastAPI
from routes import health
from routes import bigquery

version_release = "1.1.5"
app = FastAPI(title="Guigo's API", version=version_release)


app.include_router(health.router)
app.include_router(bigquery.router)

@app.get("/")
async def root():
    return {"message": f"Guigo's FastAPI Service (version {version_release})"}


