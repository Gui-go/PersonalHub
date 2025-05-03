# Use a Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    dbt-core \
    dbt-postgres  # Adjust for your database adapter (e.g., dbt-bigquery, dbt-snowflake) 
   

# Copy dbt project files (if you have a dbt project)
# COPY ./dbt_project /app/dbt_project

# Expose port for Jupyter Notebook
EXPOSE 8888

# Set environment variables for Jupyter
ENV JUPYTER_TOKEN="dbt"

# Command to start Jupyter Notebook
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=dbt"]


