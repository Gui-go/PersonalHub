



docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  -f Dockerfile \
  --push .

gcloud run deploy pyr-api \
  --image=us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated


CREATE OR REPLACE FUNCTION `personalhub14.test.remote_func`(
    col1 FLOAT64,
    col2 FLOAT64,
    col3 STRING,
    col4 FLOAT64
) RETURNS FLOAT64
REMOTE WITH CONNECTION `personalhub14.us.bq_remote_functions_connection`
OPTIONS (
  endpoint = 'https://pyr-api-415088972722.us-central1.run.app'
);



WITH your_table AS (
  SELECT 1.0 AS col1, 2.0 AS col2, "A" AS col3, 3.0 AS col4 UNION ALL
  SELECT 4.0, 1.0, "B", 2.0 UNION ALL
  SELECT 7.0, 2.0, "C", 5.0 UNION ALL
  SELECT 3.0, 5.0, "X", 2.0 UNION ALL
  SELECT 9.0, 1.0, "Y", 0.0
)
SELECT col1, col2, col3, col4,
       `personalhub14.test.remote_func`(col1, col2, col3, col4) AS result
FROM your_table;




