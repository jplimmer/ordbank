import { TestManager } from '@/components/test/test-manager';
import { getQuestion } from '@/lib/actions/test';
import { TestSettings } from '@/lib/types/test';

export default async function TestPage() {
  // TO DO - fetch test settings from database
  const settings: TestSettings = {
    direction: 'random',
    answerMode: 'random',
    questionLimit: 10,
    timeLimitMins: null,
  };

  const initialQuestion = await getQuestion(
    settings.direction,
    settings.answerMode
  );

  return (
    <div className="content-grid justify-center items-center">
      <TestManager settings={settings} initialQuestion={initialQuestion} />
    </div>
  );
}
