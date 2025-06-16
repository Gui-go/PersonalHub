import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleAuth } from 'google-auth-library';

// const TARGET_API_URL = "https://fastapi.guigo.dev.br/api/v1/";
// const TARGET_API_URL = "https://fastapi-run-241432738087.us-central1.run.app";
const TARGET_API_URL = "https://www.guigo.dev.br/api/proxy/fetch/billing_dev/genai_service_suggestions?limit=1";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
}
