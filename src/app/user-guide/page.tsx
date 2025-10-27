import { UserGuide } from '@/components/user-guide';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Guide',
  description:
    'Learn how to user Ordbank - create custom vocabulary lists for different language pairs and test your language skills effectively.',
};

export default function UserGuidePage() {
  return <UserGuide />;
}
