import './globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import type { Metadata } from 'next';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NoteHub',
    template: '%s | NoteHub',
  },
  description: 'Your notes app — organize and manage your notes easily.',
  openGraph: {
    title: 'NoteHub',
    description: 'Organize and manage your notes easily.',
    url: 'https://notehub-app.vercel.app',
    siteName: 'NoteHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoteHub — your notes app',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
};

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <div>
              {children}
              {modal}
            </div>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
