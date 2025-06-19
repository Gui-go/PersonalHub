from fastapi import FastAPI
from app.routes import base, bq_fetch

version_release = "1.1.1"
app = FastAPI(title="Guigo.dev.br API", version=version_release)

# Include routers
app.include_router(base.router)
app.include_router(bq_fetch.router)
