import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import ProfileEditForm from './ProfileEditForm';
import type { User } from '@/types/user';

export const metadata: Metadata = { title: 'Edit profile' };

export default async function EditProfilePage() {
  let user: User;
  try {
    user = await getMe();
  } catch {
    redirect('/sign-in');
  }

  return <ProfileEditForm user={user} />;
}
