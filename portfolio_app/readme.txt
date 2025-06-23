




npm install
npm run dev




my-app/
├── src/
│   ├── components/
│   │   ├── layout/             ← Navbar, Footer, Sidebar, etc.
│   │   ├── common/             ← Reusable UI elements (Button, Card)
│   │   ├── pages/              ← Components related to each route
│   │   │   ├── Home/
│   │   │   │   └── Home.tsx
│   │   │   ├── Projects/
│   │   │   │   └── Projects.tsx
│   │   │   ├── Blogs/
│   │   │   │   └── Blogs.tsx
│   │   │   ├── GeoLayers/
│   │   │   │   └── GeoLayers.tsx
│   │   │   ├── About/
│   │   │   │   └── About.tsx
│   ├── pages/                  ← Next.js routes
│   │   ├── index.tsx           ← Imports from `components/pages/Home`
│   │   ├── about.tsx
│   │   ├── blogs.tsx
│   │   ├── geolayers.tsx
│   │   ├── projects.tsx
│   ├── data/
│   │   └── content.json        ← Dynamic content and localization
│   ├── styles/
│   │   └── globals.css
│   ├── utils/                  ← Helpers or utility functions
│   └── types/                  ← TypeScript types/interfaces
├── public/                     ← Static files like images
├── Dockerfile
├── next.config.js
├── tsconfig.json
├── package.json





docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/personalhub14/personalhub-artifact-repo/portfolio-app:latest \
  -f portfolio-app.dockerfile \
  --push .





            gcloud run deploy portfolio-run \
            --image=us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/portfolio-app:latest \
            --platform=managed \
            --region=us-central1 \
            --allow-unauthenticated


npm run dev