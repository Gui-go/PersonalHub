





npm init -y







docker buildx build --platform linux/amd64 \
  -t guigo13/portfolio-app:latest  \
  -f react_portfolio/react-portfolio.dockerfile \
  --push react_portfolio/




  