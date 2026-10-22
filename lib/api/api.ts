import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const api = axios.create({ baseURL, withCredentials: true });

export function normalizeNoteTag(tag?: string) {
  if (!tag || tag.toLowerCase() === 'all') return undefined;
  const knownTags: Record<string, string> = {
    work: 'Work', personal: 'Personal', meeting: 'Meeting', todo: 'Todo', shopping: 'Shopping',
  };
  return knownTags[tag.toLowerCase()] || tag;
}
