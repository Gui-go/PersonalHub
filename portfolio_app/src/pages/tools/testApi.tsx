import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/fetchSuggestions');
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('An error occurred');
      }
    }
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
}