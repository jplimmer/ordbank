import { Answer } from '@/lib/types/test';
import {
  NextQuestionButton,
  NextQuestionButtonProps,
} from './next-question-button';
import { SubmitAnswerButton } from './submit-answer-button';

interface ResultPanelProps extends NextQuestionButtonProps, Answer {}

export function ResultPanel({
  vocabId,
  direction,
  answer,
  settings,
  setQuestion,
  resetAnswer,
}: ResultPanelProps) {
  return (
    <div>
      <SubmitAnswerButton
        vocabId={vocabId}
        direction={direction}
        answer={answer}
      />
      <NextQuestionButton
        settings={settings}
        setQuestion={setQuestion}
        resetAnswer={resetAnswer}
      />
    </div>
  );
}
