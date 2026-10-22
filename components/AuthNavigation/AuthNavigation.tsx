'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearUser } = useAuthStore();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearUser();
      router.push('/sign-in');
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.userEmail}>{user?.email}</li>
          <li><Link href="/profile" prefetch={false}>Profile</Link></li>
          <li><button className={css.logoutButton} onClick={handleLogout}>Logout</button></li>
        </>
      ) : (
        <>
          <li><Link href="/sign-in" prefetch={false}>Login</Link></li>
          <li><Link href="/sign-up" prefetch={false}>Sign up</Link></li>
        </>
      )}
    </>
  );
}
