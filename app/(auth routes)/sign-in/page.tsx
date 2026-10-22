import AuthForm from '@/components/AuthForm/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return <AuthForm mode="login" />;
}
