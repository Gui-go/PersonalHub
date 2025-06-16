import React from "react";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from "next";
import { GoogleAuth } from "google-auth-library";

type Suggestion = {
  generated_text: string;
  prompt: string;
  invoice_month: string;
  billing_account_id: string;
  project_id: string;
  project_number: string;
  project_name: string;
  service_overview: string;
};

type Props = {
  suggestions: Suggestion[];
};

const PersonalHubImprover: React.FC<Props> = ({ suggestions }) => {
  return (
    <div className="container mx-auto px-4 py-10 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            💡 GenAI Cost Optimization Suggestions
          </h1>

          {suggestions.length === 0 ? (
            <p className="text-gray-500">No suggestions available at the moment.</p>
          ) : (
            suggestions.map((item, i) => (
              <div key={i} className="mb-10 border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-1">
                  🔧 Project:{" "}
                  <span className="text-blue-600">{item.project_name}</span>
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Billing Month: {item.invoice_month}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Prompt</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{item.prompt}</p>
                </div>

                <div className="prose prose-blue max-w-none mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Generated Suggestions
                  </p>
                  <ReactMarkdown>{item.generated_text}</ReactMarkdown>
                </div>

                <div className="text-sm text-gray-700">
                  <span className="font-medium">🛠 Services Used:</span>{" "}
                  {item.service_overview}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Define API response type
type ApiResponse = {
  results: Suggestion[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const TARGET_API_URL =
    "https://fastapi-run-241432738087.us-central1.run.app/fetch/billing_dev/genai_service_suggestions?limit=1";

  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(TARGET_API_URL);

    const response = await client.request({ url: TARGET_API_URL });

    // Cast response.data to known type
    const data = response.data as ApiResponse;

    const suggestions = Array.isArray(data.results) ? data.results : [];

    return { props: { suggestions } };
  } catch (error) {
    console.error("🔥 Error fetching GenAI suggestions:", error);
    return { props: { suggestions: [] } };
  }
};
