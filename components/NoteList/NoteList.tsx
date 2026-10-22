'use client'


import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  
  const { mutate: deleteNoteMutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Помилка при видаленні нотатки:', error);
    }
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <span className={css.tag}>{note.tag}</span>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href={`/notes/${note.id}`} className={css.link} > View details </Link>

              {}
              <button 
                type="button" 
                className={css.button}
                onClick={() => deleteNoteMutate(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
