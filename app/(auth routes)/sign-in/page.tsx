'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { AuthCredentials } from '@/types/user';
import css from '@/components/AuthForm/AuthForm.module.css';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const credentials: AuthCredentials = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };

    try {
      const user = await login(credentials);
      setUser(user);
      router.replace('/profile');
      router.refresh();
    } catch (requestError) {
      const status = axios.isAxiosError(requestError) ? requestError.response?.status : undefined;
      setError(status === 401 ? 'Email or password is incorrect.' : 'Could not sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={css.input} autoComplete="email" required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={css.input} autoComplete="current-password" required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : 'Log in'}
          </button>
        </div>
        {error && <p role="alert" className={css.error}>{error}</p>}
        <p><Link href="/sign-up">Create an account</Link></p>
      </form>
    </main>
  );
}
