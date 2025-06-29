import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

// const endpoint = process.env.AZURE_AI_PROJECT_ENDPOINT;
const endpoint="https://project2wilhelm-resource.cognitiveservices.azure.com/";
// const deploymentName = process.env.AZURE_MODEL_DEPLOYMENT;
const deploymentName = "gpt-4.1";

const client = new AIProjectClient(endpoint, new DefaultAzureCredential());

export default async function handler(req, res) {
  const { messages } = req.body;
  const chatClient = await client.inference.azureOpenAI({ apiVersion: "2024-12-01-preview" });
  const result = await chatClient.chat.completions.create({
    model: deploymentName,
    messages
  });
  res.status(200).json(result.choices[0].message);
}
