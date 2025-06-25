#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly = TRUE)

# Convert to numeric if possible, otherwise leave as string
parsed_args <- lapply(args, function(x) {
  num <- suppressWarnings(as.numeric(x))
  if (is.na(num)) NA else num
})

# Sum all numeric values, ignoring NAs
numeric_values <- unlist(parsed_args)
numeric_values <- numeric_values[!is.na(numeric_values)]
result <- sum(numeric_values)

cat(result)
