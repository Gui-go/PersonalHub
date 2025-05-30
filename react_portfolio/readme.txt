





npm init -y







docker buildx build --platform linux/amd64 \
  -t guigo13/portfolio-app:latest  \
  -f react_portfolio/react-portfolio.dockerfile \
  --push react_portfolio/




            gcloud run deploy portfolio-run \
            --image=guigo13/portfolio-app:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated

