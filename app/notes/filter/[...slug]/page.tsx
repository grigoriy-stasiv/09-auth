import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type FilterPageProps = {
  params: Promise<{ slug?: string[] }>;
};

const tagNames: Record<string, string> = {
  all: 'All notes',
  todo: 'Todo',
  work: 'Work',
  personal: 'Personal',
  meeting: 'Meeting',
  shopping: 'Shopping',
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug && slug.length > 0 ? slug[0] : 'all';
  const tag = rawTag.toLowerCase() === 'all' ? 'all' : rawTag;
  const tagName = tagNames[tag] ?? tag;

  const title = `${tagName} notes | NoteHub`;
  const description =
    tag === 'all'
      ? 'Browse all your notes in NoteHub.'
      : `Browse your ${tagName} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/${tag}`,
      images: [
        {
          url: 'https://goit.global',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  const rawTag = slug && slug.length > 0 ? slug[0] : 'all';
  const tag = rawTag.toLowerCase();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, perPage: 12, search: '', tag }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
