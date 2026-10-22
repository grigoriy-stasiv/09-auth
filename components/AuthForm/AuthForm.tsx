'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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
          } catch (requestError) {
            const status = axios.isAxiosError(requestError)
              ? requestError.response?.status
              : undefined;

            if (registering && status === 409) {
              setError('An account with this email already exists. Sign in instead.');
            } else if (status === 401) {
              setError('Email or password is incorrect.');
            } else {
              setError(registering
                ? 'Could not create your account. Check the details and try again.'
                : 'Could not sign in. Please try again.');
            }
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
            {error && <p role="alert" className={css.error}>
              {error}
              {registering && error.includes('already exists') && <> <Link href="/sign-in">Go to sign in</Link></>}
            </p>}
          </Form>
        )}
      </Formik>
    </main>
  );
}
