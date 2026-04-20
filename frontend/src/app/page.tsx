'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  environment: string;
  timestamp: string;
  service: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError('NEXT_PUBLIC_API_URL is not configured');
      return;
    }

    fetch(`${apiUrl}/api/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Todo App
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Backend Health Check
          </h2>
          
          {error && (
            <div className="text-red-600">
              Error: {error}
            </div>
          )}
          
          {health && (
            <div className="text-green-600">
              ✓ Backend connected
              <pre className="mt-2 text-xs text-slate-600">
                {JSON.stringify(health, null, 2)}
              </pre>
            </div>
          )}
          
          {!health && !error && (
            <div className="text-slate-500">Loading...</div>
          )}
        </div>
      </div>
    </main>
  );
}

