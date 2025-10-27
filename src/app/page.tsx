import { Home } from '@/components/home';
import { LandingPage } from '@/components/landing-page';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { userId } = await auth();

  if (userId) {
    return {
      title: 'Home',
      description: 'Manage your vocabulary lists and test yourself',
    };
  }

  return {
    title: "Ordbank - Learn vocabulary that's important to you",
    description:
      'Learn vocabulary across multiple languages - create personalised word lists and test yourself wth multiple choice or typed answers.',
  };
}

export default function HomePage() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <Home />
      </SignedIn>
    </>
  );
}
