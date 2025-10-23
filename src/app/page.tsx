import { Home } from '@/components/home';
import { LandingPage } from '@/components/landing-page';
import { SignedIn, SignedOut } from '@clerk/nextjs';

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
