import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface MultipleChoiceAnswerProps {
  options: string[];
  value: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export function MultipleChoiceAnswer({
  options,
  value,
  setAnswer,
  disabled = false,
}: MultipleChoiceAnswerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) setAnswer(val);
      }}
      size="lg"
      className="gap-4"
      disabled={disabled}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className="text-2xl rounded-md"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
