'use client'; import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';

interface Props { id: string; }

export default function NotePreview({ id }: Props)

{
    const router = useRouter(); const { data: note, error, isLoading, } = useQuery({
        queryKey: ['note', id], queryFn: () => fetchNoteById(id), refetchOnMount: false,
    }); return (<Modal onClose={() => router.back()}>
        <div style={{ padding: '24px', maxWidth: '600px' }}>
            {isLoading && <p>Loading note details...</p>}
            
            {(error || (!isLoading && !note)) && (<p>Note not found.</p>)}
            {note && (<> <h2>{note.title}</h2> <p style={{ whiteSpace: 'pre-wrap' }}>
                {note.content} </p> {note.tag && (<p> <strong>Tag:</strong> {note.tag} </p>)} <p>
                    <strong>Created date:</strong>{' '} {new Date(note.createdAt).toLocaleDateString()}
                </p> <button type="button" onClick={() => router.back()}> ← Back </button> </>)}
        </div>
    </Modal>);
}
