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
    ? ((currentQuestion - 1) / questionLimit) * 100
    : null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {questionLimit ? (
        <>
          <h1 className="sr-only">
            Question {currentQuestion} of {questionLimit}
          </h1>
          <Progress value={progress} className="w-full" />
          <span>{questionLimit}</span>
        </>
      ) : (
        <h1>Question {currentQuestion}</h1>
      )}
    </div>
  );
}
