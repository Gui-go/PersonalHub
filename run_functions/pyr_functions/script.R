#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly = TRUE)

# Convert all args to numeric, with NA if not convertible
num_args <- suppressWarnings(as.numeric(args))

# If any values couldn't be converted or if too few inputs
if (any(is.na(num_args)) || length(num_args) < 2) {
  cat("NA\n")
  quit(status = 0)
}

# Separate dependent and independent variables
dep <- num_args[1]
indep <- num_args[-1]

# Create a one-row data.frame
df <- as.data.frame(matrix(c(dep, indep), nrow = 1))
colnames(df) <- c("y", paste0("x", seq_along(indep)))

# Fit linear model (this will perfectly fit one row, but is useful for testing)
model <- tryCatch(lm(y ~ ., data = df), error = function(e) NULL)

if (is.null(model)) {
  cat("NA\n")
} else {
  # Output coefficients space-separated
  cat(model$coefficients, sep = " ")
}
