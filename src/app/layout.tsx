import NavBar from '@/components/NavBar';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ordbank',
  description: 'A Next.js app for learning Swedish vocabulary',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased content-grid grid-rows-[1fr_auto] min-h-svh`}
      >
        {children}
        <footer>
          <NavBar />
        </footer>
      </body>
    </html>
  );
}
