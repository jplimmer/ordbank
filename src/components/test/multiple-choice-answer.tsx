import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface MultipleChoiceAnswerProps {
  options: string[];
  value: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
}

export function MultipleChoiceAnswer({
  options,
  value,
  setAnswer,
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
