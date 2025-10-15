import { getQuestion } from '@/lib/actions/test';
import { Question, TestSettings } from '@/lib/types/test';
import { Button } from '../ui/button';

interface NextQuestionButtonProps {
  settings: TestSettings;
  setQuestion: React.Dispatch<React.SetStateAction<Question>>;
}

export function NextQuestionButton({
  settings,
  setQuestion,
}: NextQuestionButtonProps) {
  return (
    <Button
      onClick={async () => {
        const q = await getQuestion(settings.direction, settings.answerMode);
        setQuestion(q);
      }}
    >
      Next question
    </Button>
  );
}
