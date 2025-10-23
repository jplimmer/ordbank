import { Header, NavBar } from '@/components/layout';
import { LanguagePairProvider } from '@/contexts/language-pair';
import { ThemeProvider } from '@/contexts/theme-provider';
import { getActiveLanguagePair } from '@/lib/actions/active-language-pair';
import { LanguagePair } from '@/lib/types/language-pair';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  let initialPair: LanguagePair | null;
  const langPairResult = await getActiveLanguagePair();
  if (langPairResult.success) {
    initialPair = langPairResult.data;
  } else {
    initialPair = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="OrdBank" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={{ cssLayerName: 'clerk' }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
          >
            <LanguagePairProvider initialPair={initialPair}>
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
        </ClerkProvider>
      </body>
    </html>
  );
}
