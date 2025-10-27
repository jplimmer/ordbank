import { RefObject } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TypedAnswerProps {
  value: string;
  onSetAnswer: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
}

export function TypedAnswer({
  value,
  onSetAnswer,
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
    <>
      <Label htmlFor="answer-input" className="sr-only">
        Enter your answer
      </Label>
      <Input
        ref={ref}
        type="text"
        id="answer-input"
        placeholder="Enter your answer..."
        value={value}
        onChange={(e) => onSetAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </>
  );
}
