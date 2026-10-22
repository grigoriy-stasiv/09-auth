'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NotesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Notes page error:', error);
  }, [error]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Could not fetch the list of notes.</h2>
      <p style={{ color: 'red', margin: '10px 0' }}>{error.message}</p>
      <button 
        onClick={() => reset()}
        style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}
