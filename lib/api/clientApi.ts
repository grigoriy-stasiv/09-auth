'use client';

import type { AxiosRequestConfig } from 'axios';
import { api, normalizeNoteTag } from './api';
import type { Note, CreateNoteInput } from '@/types/note';
import type { FetchNotesResponse } from '@/types/api';
import type { AuthCredentials, RegistrationInput, User } from '@/types/user';

export async function fetchNotes(params: { page: number; perPage: number; search: string; tag?: string }) {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params: { ...params, tag: normalizeNoteTag(params.tag) } });
  return data;
}

export async function createNote(note: CreateNoteInput) {
  const { data } = await api.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function register(input: RegistrationInput) {
  const { data } = await api.post<User>('/auth/register', input);
  return data;
}

export async function login(input: AuthCredentials) {
  const { data } = await api.post<User>('/auth/login', input);
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function checkSession(config?: AxiosRequestConfig) {
  const { data } = await api.get<{ success: boolean }>('/auth/session', config);
  return data;
}

export async function getMe(config?: AxiosRequestConfig) {
  const { data } = await api.get<User>('/users/me', config);
  return data;
}

export async function updateMe(username: string) {
  const { data } = await api.patch<User>('/users/me', { username });
  return data;
}
