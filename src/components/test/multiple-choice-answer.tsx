import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface MultipleChoiceAnswerProps {
  options: string[];
  value: string;
  onSetAnswer: (value: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceAnswer({
  options,
  value,
  onSetAnswer,
  disabled = false,
}: MultipleChoiceAnswerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onSetAnswer(val);
      }}
      size="lg"
      className="flex-col md:flex-row items-stretch justify-self-center gap-4"
      disabled={disabled}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className="text-xl font-normal rounded-md border py-2 md:py-4 px-4 h-fit"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
