import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Portal | One Platform. A Connected Campus.',
  description: 'Unified Campus Management and Engagement Portal for Students, Faculty, and Clubs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className={`${inter.className} min-h-screen text-slate-900 antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
