import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/api/serverApi';

export default async function PrivateRoutesLayout({ children }: { children: ReactNode }) {
  try {
    await getMe();
  } catch {
    redirect('/sign-in');
  }

  return children;
}
