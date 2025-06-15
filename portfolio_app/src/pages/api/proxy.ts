// import type { NextApiRequest, NextApiResponse } from 'next';
// import { GoogleAuth } from 'google-auth-library';

// // const TARGET_API_URL = "https://fastapi.guigo.dev.br/api/v1/";
// const TARGET_API_URL = "https://fastapi-run-241432738087.us-central1.run.app";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   try {
//     // 1. Get Google auth client for the FastAPI service URL
//     const auth = new GoogleAuth();
//     const client = await auth.getIdTokenClient(TARGET_API_URL);

//     // 2. Authenticated request to FastAPI
//     const response = await client.request({ url: TARGET_API_URL });

//     // 3. Return response to browser
//     res.status(200).json(response.data);
//   } catch (err) {
//     console.error("Proxy error:", err);
//     res.status(500).json({ error: "Failed to fetch API data" });
//   }
// }

// src/pages/api/proxy.ts

// src/pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_BASE_URL = 'https://fastapi.guigo.dev.br';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.url?.replace('/api/proxy', '') || '';
  const targetUrl = `${BACKEND_BASE_URL}${path}`;

  console.log(`➡️ Proxying request to: ${targetUrl}`);

  // Clean headers: only forward simple string headers
  const filteredHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      filteredHeaders[key] = value;
    } else if (Array.isArray(value)) {
      filteredHeaders[key] = value.join(', '); // Convert array headers to comma-separated string
    }
  }

  // Optional: remove unsafe headers
  delete filteredHeaders['host'];
  delete filteredHeaders['connection'];

  try {
    const proxyRes = await fetch(targetUrl, {
      method: req.method,
      headers: filteredHeaders,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? JSON.stringify(req.body) : undefined,
    });

    const contentType = proxyRes.headers.get('content-type') || '';
    const status = proxyRes.status;

    res.status(status);

    if (contentType.includes('application/json')) {
      const json = await proxyRes.json();
      res.setHeader('Content-Type', contentType);
      res.json(json);
    } else {
      const text = await proxyRes.text();
      res.setHeader('Content-Type', contentType);
      res.send(text);
    }
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
}
