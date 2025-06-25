args <- commandArgs(trailingOnly=TRUE)
number <- as.numeric(args[1])
squared <- number^2
cat(squared)
