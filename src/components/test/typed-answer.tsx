import { Input } from '../ui/input';

interface TypedAnswerProps {
  value: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export function TypedAnswer({
  value,
  setAnswer,
  disabled = false,
}: TypedAnswerProps) {
  return (
    <Input
      type="text"
      placeholder="Enter your answer..."
      value={value}
      onChange={(e) => setAnswer(e.target.value)}
      disabled={disabled}
    />
  );
}
