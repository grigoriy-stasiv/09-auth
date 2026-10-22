import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content
        ? note.content.slice(0, 160)
        : `Перегляньте нотатку "${note.title}" у NoteHub.`,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content
          ? note.content.slice(0, 160)
          : `Перегляньте нотатку "${note.title}" у NoteHub.`,
        url: `https://notehub.com/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub',
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Нотатку не знайдено | NoteHub',
      description: 'Не вдалося знайти запитану нотатку.',
    };
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
