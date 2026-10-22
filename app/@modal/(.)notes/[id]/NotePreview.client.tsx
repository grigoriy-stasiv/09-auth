
'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, error, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      <div style={{ padding: 24, maxWidth: 600 }}>
        {isLoading && <p role="status">Loading note details...</p>}
        {error && <p role="alert">Could not load this note.</p>}
        {!isLoading && !error && !note && <p>Note not found.</p>}
        {note && (
          <>
            <h2>{note.title}</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
            {note.tag && <p><strong>Tag:</strong> {note.tag}</p>}
            <p><strong>Created date:</strong> {new Date(note.createdAt).toLocaleDateString()}</p>
            <button type="button" onClick={() => router.back()}>← Back</button>
          </>
        )}
      </div>
    </Modal>
  );
}
