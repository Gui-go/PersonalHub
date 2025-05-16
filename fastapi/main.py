from fastapi import FastAPI
from google.cloud import bigquery
import os

app = FastAPI()

# Initialize BigQuery client
project_id = os.getenv("PROJECT_ID")
client = bigquery.Client(project=project_id)

@app.get("/query")
async def run_query():
    query = """
    SELECT *
    FROM `database.df_locations`
    LIMIT 10
    """
    query_job = client.query(query)
    results = query_job.result()
    
    # Convert results to list of dicts
    data = [dict(row) for row in results]
    return {"results": data}

@app.get("/")
async def root():
    return {"message": "FastAPI BigQuery Service"}

