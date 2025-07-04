



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


curl -X POST -H "Content-Type: application/json" -d '{"calls": ["{\"data\":[{\"id\":1,\"dep_var\":1.0,\"ind_var1\":2.0,\"ind_var2\":1.0,\"ind_var3\":0.5},{\"id\":2,\"dep_var\":2.0,\"ind_var1\":4.0,\"ind_var2\":3.0,\"ind_var3\":1.0},{\"id\":3,\"dep_var\":3.0,\"ind_var1\":6.0,\"ind_var2\":5.0,\"ind_var3\":1.5},{\"id\":4,\"dep_var\":4.0,\"ind_var1\":8.0,\"ind_var2\":7.0,\"ind_var3\":2.0},{\"id\":5,\"dep_var\":5.0,\"ind_var1\":10.0,\"ind_var2\":9.0,\"ind_var3\":2.5}],\"y\":\"dep_var\",\"x\":[\"ind_var1\",\"ind_var2\"]}"]}' https://pyr-api-415088972722.us-central1.run.app 
curl -X POST -H "Content-Type: application/json" -d '{"calls": ["{\"data\":[{\"id\":1,\"dep_var\":1.0,\"ind_var1\":2.0,\"ind_var2\":1.0,\"ind_var3\":0.5},{\"id\":2,\"dep_var\":2.0,\"ind_var1\":4.0,\"ind_var2\":3.0,\"ind_var3\":1.0},{\"id\":3,\"dep_var\":3.0,\"ind_var1\":6.0,\"ind_var2\":5.0,\"ind_var3\":1.5},{\"id\":4,\"dep_var\":4.0,\"ind_var1\":8.0,\"ind_var2\":7.0,\"ind_var3\":2.0},{\"id\":5,\"dep_var\":5.0,\"ind_var1\":10.0,\"ind_var2\":9.0,\"ind_var3\":2.5}],\"y\":\"dep_var\",\"x\":[\"ind_var1\",\"ind_var2\"]}"]}' http://localhost:8080/
