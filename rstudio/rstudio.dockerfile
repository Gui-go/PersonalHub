FROM rocker/geospatial

LABEL mantainer=guilhermeviegas1993@gmail.com

RUN apt update -y
RUN apt install -y 
    
VOLUME /home/rstudio/

RUN R -e "install.packages('Rcpp')"
RUN R -e "install.packages('RcppArmadillo')"

RUN R -e "install.packages('janitor')"
RUN R -e "install.packages('rio')"
RUN R -e "install.packages('styler')"
RUN R -e "install.packages('MLmetrics')"
RUN R -e "install.packages('lmtest')"


RUN R -e "install.packages('rnaturalearth')"

