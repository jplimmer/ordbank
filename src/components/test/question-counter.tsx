import { Progress } from '../ui/progress';

interface QuestionCounterProps {
  questionLimit: number | null;
  currentQuestion: number;
}

export function QuestionCounter({
  questionLimit,
  currentQuestion,
}: QuestionCounterProps) {
  const progress = questionLimit
    ? (currentQuestion / questionLimit) * 100
    : null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {questionLimit ? (
        <>
          <Progress value={progress} className="w-full" />
          <span>{questionLimit}</span>
        </>
      ) : (
        <span>Question {currentQuestion}</span>
      )}
    </div>
  );
}
