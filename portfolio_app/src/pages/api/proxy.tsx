import express from 'express';
import { GoogleAuth } from 'google-auth-library';

const router = express.Router();

const TARGET_API_URL = "https://fastapi.guigo.dev.br/api/v1/";
// const TARGET_API_URL = "https://fastapi-run-241432738087.us-central1.run.app";

router.get('/api/proxy', async (req, res) => {
  try {
    // 1. Get Google auth client for the FastAPI service URL
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(TARGET_API_URL);

    // 2. Authenticated request to FastAPI
    const response = await client.request({ url: TARGET_API_URL });

    // 3. Return response to browser
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Failed to fetch API data" });
  }
});

export default router;
