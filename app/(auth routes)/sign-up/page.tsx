import AuthForm from '@/components/AuthForm/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignUpPage() {
  return <AuthForm mode="register" />;
}
