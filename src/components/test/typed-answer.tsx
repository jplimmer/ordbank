import { Input } from '../ui/input';

interface TypedAnswerProps {
  value: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
}

export function TypedAnswer({ value, setAnswer }: TypedAnswerProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
}
