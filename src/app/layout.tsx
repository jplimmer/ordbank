import { Header, NavBar } from '@/components/layout';
import { LanguagePairProvider } from '@/contexts/language-pair';
import { ThemeProvider } from '@/contexts/theme-provider';
import { getActiveLanguagePair } from '@/lib/actions/active-language-pair';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
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
  description: 'A Next.js app for learning vocabulary',
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const langPairResult = await getActiveLanguagePair();
  // TO DO - redirect to account to set active language pair if none found
  if (!langPairResult.success) {
    notFound();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="OrdBank" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguagePairProvider initialPair={langPairResult.data}>
            <div className="content-grid grid-rows-[auto_1fr_auto] min-h-svh">
              <Header />
              <main className="full-width content-grid">{children}</main>
              <footer>
                <NavBar />
              </footer>
            </div>
          </LanguagePairProvider>
          {modal}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
