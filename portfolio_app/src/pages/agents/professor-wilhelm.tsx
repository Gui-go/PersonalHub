'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_AZURE_WILHELM_KEY || '';

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'API key not configured.' }]);
      return;
    }

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(
        'https://project2wilhelm-resource.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify({
            messages: [...messages, userMsg]
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`${res.status} ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        data.choices?.[0]?.message || {
          role: 'assistant',
          content: "Hmm, I couldn't generate a response."
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto mt-10 p-4 border rounded-2xl shadow-xl bg-white">
      <div className="flex flex-col gap-2 mb-4 max-h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === 'user'
                ? 'bg-blue-100 self-end'
                : 'bg-gray-100 self-start'
            }`}
          >
            <p className="text-sm text-gray-800">{m.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
