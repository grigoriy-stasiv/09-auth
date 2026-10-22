'use client';

import { useNoteStore } from '../../lib/store/noteStore';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
    onError: error => {
      console.error('Помилка при створенні нотатки:', error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag as 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping',
    });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form || ''}>
      <div className={css.fieldGroup || ''}>
        <label htmlFor="title" className={css.label || ''}>
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={draft?.title || ''}
          onChange={handleChange}
          className={css.input || ''}
          disabled={isPending}
          required
        />
      </div>

      <div className={css.fieldGroup || ''}>
        <label htmlFor="content" className={css.label || ''}>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={draft?.content || ''}
          onChange={handleChange}
          className={css.textarea || ''}
          disabled={isPending}
          required
        />
      </div>

      <div className={css.fieldGroup || ''}>
        <label htmlFor="tag" className={css.label || ''}>
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          value={draft?.tag || 'Todo'}
          onChange={handleChange}
          className={css.select || ''}
          disabled={isPending}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions || ''}>
        <button
          type="button"
          onClick={() => router.back()}
          className={css.buttonCancel || css.cancelButton || ''}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.buttonSubmit || css.submitButton || ''}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
