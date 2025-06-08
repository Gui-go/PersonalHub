





npm init -y







docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/portfolio-app:latest \
  -f react_portfolio/react-portfolio.dockerfile \
  --push react_portfolio/





            gcloud run deploy portfolio-run \
            --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/portfolio-app:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated

