'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { login, register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { AuthCredentials, RegistrationInput, User } from '@/types/user';
import css from './AuthForm.module.css';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Use at least 8 characters').required('Password is required'),
});

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const registering = mode === 'register';

  return (
    <main className={css.mainContent}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, helpers) => {
          setError('');
          try {
            let user: User;
            if (registering) {
              await register(values as RegistrationInput);
              user = await login(values as AuthCredentials);
            } else {
              user = await login(values as AuthCredentials);
            }
            setUser(user);
            router.replace('/profile');
            router.refresh();
          } catch {
            setError(registering ? 'Could not create your account. Check the details and try again.' : 'Email or password is incorrect.');
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <h1 className={css.formTitle}>{registering ? 'Sign up' : 'Sign in'}</h1>
            <div className={css.formGroup}>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" className={css.input} autoComplete="email" />
              <ErrorMessage name="email" component="p" className={css.fieldError} />
            </div>
            <div className={css.formGroup}>
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" type="password" className={css.input} autoComplete={registering ? 'new-password' : 'current-password'} />
              <ErrorMessage name="password" component="p" className={css.fieldError} />
            </div>
            <div className={css.actions}>
              <button type="submit" className={css.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Please wait…' : registering ? 'Register' : 'Log in'}
              </button>
            </div>
            {error && <p role="alert" className={css.error}>{error}</p>}
          </Form>
        )}
      </Formik>
    </main>
  );
}
