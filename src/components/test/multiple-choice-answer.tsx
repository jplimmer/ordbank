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
      className="flex-col md:flex-row items-stretch justify-self-center gap-4"
      disabled={disabled}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className="text-xl font-normal rounded-md border py-8 px-4"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
