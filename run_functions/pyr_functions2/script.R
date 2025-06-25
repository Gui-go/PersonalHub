#!/usr/bin/env Rscript

# Get command line arguments
args <- commandArgs(trailingOnly = TRUE)

# Expecting three arguments: col1 (numeric), col2 (numeric), col3 (character)
col1 <- as.numeric(args[1])
col2 <- as.numeric(args[2])
col3 <- args[3]

# Example computation: sum of col1 and col2 if col3 is not "C"
result <- if (col3 != "C") col1 + col2 else 0

# Output result
cat(result)