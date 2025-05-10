import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/ui/header';
import { FilmRollLayout } from '@/components/ui/film-roll-layout';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Forge - Cinematic AI Generator',
  description: 'Create stunning AI-generated action scenes',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <FilmRollLayout>
          <Header />
          {children}
          <Toaster 
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </FilmRollLayout>
      </body>
    </html>
  );
}
