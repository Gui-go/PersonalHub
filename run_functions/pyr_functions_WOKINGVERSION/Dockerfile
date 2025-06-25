FROM rocker/geospatial:latest

LABEL mantainer=guilhermeviegas1993@gmail.com

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    r-base-dev \
    libblas-dev \
    liblapack-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app

COPY app.py square.R ./

EXPOSE 8080

CMD ["python3", "app.py"]
