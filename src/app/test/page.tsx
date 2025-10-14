import { TestManager } from '@/components/test/test-manager';
import { TestSettings } from '@/lib/types/test';

export default async function TestPage() {
  // TO DO - fetch test settings from database
  const settings: TestSettings = {
    direction: 'random',
    answerMode: 'random',
    questionLimit: null,
    timeLimitMins: null,
  };

  return (
    <div>
      <TestManager settings={settings} />
    </div>
  );
}
