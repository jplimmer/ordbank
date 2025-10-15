import { getQuestion } from '@/lib/actions/test';
import { Question, TestSettings } from '@/lib/types/test';
import { Button } from '../ui/button';

export interface NextQuestionButtonProps {
  settings: TestSettings;
  setQuestion: React.Dispatch<React.SetStateAction<Question>>;
  resetAnswer: () => void;
}

export function NextQuestionButton({
  settings,
  setQuestion,
  resetAnswer,
}: NextQuestionButtonProps) {
  return (
    <Button
      onClick={async () => {
        const q = await getQuestion(settings.direction, settings.answerMode);
        setQuestion(q);
        resetAnswer();
      }}
      className="justify-self-center"
    >
      Next question
    </Button>
  );
}
