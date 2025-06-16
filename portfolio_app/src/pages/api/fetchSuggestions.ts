import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // Get the Identity Token from the metadata server
    const metadataServerUrl =
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://fastapi-run-241432738087.us-central1.run.app';
    const tokenResponse = await fetch(metadataServerUrl, {
      headers: {
        'Metadata-Flavor': 'Google',
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch Identity Token');
    }

    const token = await tokenResponse.text();

    // Make the request to the FastAPI endpoint
    const apiUrl =
      'https://fastapi-run-241432738087.us-central1.run.app/fetch/billing_dev/genai_service_suggestions?limit=1';
    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}