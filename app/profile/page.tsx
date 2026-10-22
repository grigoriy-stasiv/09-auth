import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import css from './profile.module.css';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  let user;
  try { user = await getMe(); } catch { redirect('/sign-in'); }

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard}>
        <div className={css.header}>
          <h1>Profile Page</h1>
          <Link href="/profile/edit" className={css.editButton}>Edit Profile</Link>
        </div>
        <div className={css.avatarWrapper}>
          {user.avatar ? <Image src={user.avatar} alt="User avatar" width={120} height={120} className={css.avatar} /> : <div className={css.avatarPlaceholder} aria-label="No avatar">{user.username.slice(0, 1).toUpperCase()}</div>}
        </div>
        <div className={css.profileInfo}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </section>
    </main>
  );
}
