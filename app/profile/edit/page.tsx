import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import ProfileEditForm from './ProfileEditForm';

export const metadata: Metadata = { title: 'Edit profile' };

export default async function EditProfilePage() {
  try {
    const user = await getMe();
    return <ProfileEditForm user={user} />;
  } catch {
    redirect('/sign-in');
  }
}
