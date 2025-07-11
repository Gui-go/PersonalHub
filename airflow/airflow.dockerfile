FROM apache/airflow:latest

USER root

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER airflow

COPY requirements.txt /

RUN pip install --no-cache-dir -r /requirements.txt

COPY dags /opt/airflow/dags

COPY plugins /opt/airflow/plugins

EXPOSE 8080

CMD ["airflow", "webserver"]
