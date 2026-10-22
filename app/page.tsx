import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}
    >
      <h1>Welcome to NoteHub 📝</h1>
      <p>Your personal place for brilliant ideas and quick notes.</p>
      <div style={{ marginTop: '20px' }}>
        <Link
          href="/notes"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Open My Notes
        </Link>
      </div>
    </main>
  );
}
