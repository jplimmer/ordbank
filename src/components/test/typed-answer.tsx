import { RefObject } from 'react';
import { Input } from '../ui/input';

interface TypedAnswerProps {
  value: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  onSubmit?: () => void;
  disabled?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
}

export function TypedAnswer({
  value,
  setAnswer,
  onSubmit,
  disabled = false,
  ref,
}: TypedAnswerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      placeholder="Enter your answer..."
      value={value}
      onChange={(e) => setAnswer(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    />
  );
}
