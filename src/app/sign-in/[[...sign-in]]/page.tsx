import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your vocabulary lists and continue learning.',
};

export default function SignInPage() {
  return (
    <div className="grid place-items-center">
      <SignIn />
    </div>
  );
}
