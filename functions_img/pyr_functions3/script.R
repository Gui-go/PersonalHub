#!/usr/bin/env Rscript

# Install jsonlite if not available
if (!require("jsonlite")) install.packages("jsonlite", repos="http://cran.rstudio.com/")
library(jsonlite)

# Get command line argument (CSV file path)
args <- commandArgs(trailingOnly = TRUE)
csv_file <- args[1]

# Read CSV
data <- read.csv(csv_file)

# Function to perform linear regression for a single dependent variable
perform_lm <- function(dep_var, ind_vars, data) {
  if (length(ind_vars) == 0) {
    stop("At least one independent variable (starting with 'ind_') is required")
  }
  
  # Construct formula: dep_var ~ ind_var1 + ind_var2 + ...
  formula_str <- paste(dep_var, "~", paste(ind_vars, collapse = " + "))
  formula <- as.formula(formula_str)
  
  # Perform linear regression
  model <- lm(formula, data = data)
  
  # Return all coefficients
  coef(model)
}

# Identify dependent and independent variables
dep_vars <- names(data)[grepl("^dep_", names(data))]
ind_vars <- names(data)[grepl("^ind_", names(data))]

# Validate input
if (length(dep_vars) == 0) {
  stop("At least one dependent variable (starting with 'dep_') is required")
}

# Perform regression for each dependent variable
results <- lapply(dep_vars, function(dep_var) {
  coef <- perform_lm(dep_var, ind_vars, data)
  # Convert coefficients to a named list for JSON output
  as.list(coef)
})

# Name results by dependent variable
names(results) <- dep_vars

# Output results as JSON
cat(toJSON(results, auto_unbox = TRUE))


# # Install jsonlite if not available
# if (!require("jsonlite")) install.packages("jsonlite")
# library(jsonlite)

# # Get command line argument (CSV file path)
# args <- commandArgs(trailingOnly = TRUE)
# csv_file <- args[1]

# # Read CSV
# data <- read.csv(csv_file)

# # Identify dependent and independent variables
# dep_var <- names(data)[grepl("^dep_", names(data))]
# ind_vars <- names(data)[grepl("^ind_", names(data))]

# if (length(dep_var) != 1) {
#   stop("Exactly one column must start with 'dep_'")
# }
# if (length(ind_vars) == 0) {
#   stop("At least one column must start with 'ind_'")
# }

# # Construct formula for lm()
# formula_str <- paste(dep_var, "~", paste(ind_vars, collapse = " + "))
# formula <- as.formula(formula_str)

# # Perform linear regression
# model <- lm(formula, data = data)

# coef(model)[["(Intercept)"]]
# coef(model)[["x"]]
# coef(model)[["z"]]

# # Output coefficients as JSON
# cat(toJSON(coef))