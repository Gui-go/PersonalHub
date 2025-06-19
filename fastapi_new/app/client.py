from google.cloud import bigquery
from app.config import PROJECT_ID

client = bigquery.Client(project=PROJECT_ID)
