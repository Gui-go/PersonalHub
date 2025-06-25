set.seed(42)

n <- 10  # number of rows

# Simulate numeric predictors
col2 <- runif(n, 0, 10)
col4 <- runif(n, 0, 5)

# Simulate a categorical variable (string)
col3 <- sample(c("A", "B", "C", "D"), n, replace = TRUE)

# Simulate dependent variable as a linear combination + noise
col1 <- 2 * col2 + 3 * col4 + rnorm(n, mean = 0, sd = 2)

# Combine into a data frame
df <- data.frame(
  col1 = round(col1, 2),
  col2 = round(col2, 2),
  col3 = col3,
  col4 = round(col4, 2)
)

# Print simulated data
print(df)
