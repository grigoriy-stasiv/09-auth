
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Link from 'next/link';
import css from './page.module.css';

interface Props {
  id: string;
}

export default function NoteDetailsClient({ id }: Props) {
  const { data: note, error, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p style={{ padding: '20px' }}>Loading note details...</p>;
  if (error || !note) return <p style={{ padding: '20px' }}>Note not found.</p>;

  return (
  <div className={css.container}>
    <Link href="/notes" className={css.backLink}>
      ← Back to Notes
    </Link>
    
    <div className={css.item}>
      <header className={css.header}>
        <h2>{note.title}</h2>
      </header>
      
      <div className={css.content}>
        <p>{note.content}</p>
      </div>

      {note.tag && (
        <span className={css.tag}>
          {note.tag}
        </span>
      )}
      
      <div className={css.date}>
        Created date: {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);

}
