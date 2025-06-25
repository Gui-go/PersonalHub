



docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  -f Dockerfile \
  --push .

gcloud run deploy pyr-api \
  --image=us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/pyr-functions:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated





-- Create the table
CREATE TABLE `your_project.your_dataset.my_table` (
  id INT64,
  dep_var FLOAT64,
  ind_var1 FLOAT64,
  ind_var2 FLOAT64,
  ind_var3 FLOAT64
);

-- Insert fake data
INSERT INTO `your_project.your_dataset.my_table` (id, dep_var, ind_var1, ind_var2, ind_var3)
VALUES
  (1, 1.0, 2.0, 1.0, 0.5),
  (2, 2.0, 4.0, 3.0, 1.0),
  (3, 3.0, 6.0, 5.0, 1.5),
  (4, 4.0, 8.0, 7.0, 2.0),
  (5, 5.0, 10.0, 9.0, 2.5);