import TestSettingsForm from '@/components/TestSettings/TestSettingsForm';
import { getCurrentUserProfile } from '@/lib/user';

export default async function TestSettingsPage() {
  const userProfile = await getCurrentUserProfile();

  return (
    <div className="flex justify-center items-center p-6 m-8 border rounded-lg shadow-2xl">
      <TestSettingsForm userProfile={userProfile} />
    </div>
  );
}
