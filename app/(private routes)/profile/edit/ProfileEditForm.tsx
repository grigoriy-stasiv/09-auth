'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';
import css from '../profile.module.css';
import formCss from './edit.module.css';

export default function ProfileEditForm({ user }: { user: User }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard}>
        <h1>Edit Profile</h1>
        <div className={css.avatarWrapper}>
          {user.avatar && <Image src={user.avatar} alt="User avatar" width={120} height={120} className={css.avatar} />}
        </div>
        <Formik initialValues={{ username: user.username }} onSubmit={async ({ username }, helpers) => {
          try {
            const updated = await updateMe(username);
            setUser(updated);
            router.replace('/profile');
            router.refresh();
          } catch {
            setError('Could not save profile. Please try again.');
          } finally { helpers.setSubmitting(false); }
        }}>
          {({ isSubmitting }) => <Form className={formCss.form}>
            <div className={formCss.formGroup}>
              <label htmlFor="username">Username:</label>
              <Field id="username" name="username" className={formCss.input} required minLength={2} />
            </div>
            <p>Email: {user.email}</p>
            <div className={formCss.actions}>
              <button type="submit" className={formCss.submitButton} disabled={isSubmitting}>Save</button>
              <button type="button" className={formCss.cancelButton} onClick={() => router.back()}>Cancel</button>
            </div>
            {error && <p role="alert" className={formCss.error}>{error}</p>}
          </Form>}
        </Formik>
      </section>
    </main>
  );
}
