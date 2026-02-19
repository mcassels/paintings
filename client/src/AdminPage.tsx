import { useState } from 'react';
import { Button } from 'antd';

function getCacheClearUrl(): string | null {
  const fetchUrl = process.env.REACT_APP_AIRTABLE_FETCH_URL;
  if (!fetchUrl || fetchUrl.startsWith('https://api.airtable.com')) {
    return null;
  }
  const origin = new URL(fetchUrl).origin;
  return `${origin}/cache/clear`;
}

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const cacheClearUrl = getCacheClearUrl();

  async function handleClearCache() {
    if (!cacheClearUrl) return;
    setStatus('loading');
    try {
      const res = await fetch(cacheClearUrl, { method: 'POST' });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">James Gordaneer site administration</h1>
      <div className="flex flex-col gap-3 max-w-xs">
        <Button
          onClick={handleClearCache}
          loading={status === 'loading'}
          disabled={!cacheClearUrl}
          title={!cacheClearUrl ? 'Not available when pointing directly at Airtable' : undefined}
        >
          Clear airtable cache
        </Button>
        {status === 'success' && <p className="text-green-600">Cache cleared.</p>}
        {status === 'error' && <p className="text-red-600">Failed to clear cache.</p>}
        {!cacheClearUrl && (
          <p className="text-gray-500 text-sm">
            Pointing directly at Airtable — no cache to clear.
          </p>
        )}
      </div>
    </div>
  );
}
