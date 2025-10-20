import { useLanguagePairContext } from '@/contexts/language-pair';
import { DirectionSettingEnum, TestSettings } from '@/lib/types/test';
import { MoveRight } from 'lucide-react';
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../ui/field';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function DirectionFieldSet({
  initialDirection,
}: {
  initialDirection: TestSettings['direction'];
}) {
  const langPair = useLanguagePairContext().activePair;

  const createDirectionFieldTitle = (
    direction: TestSettings['direction']
  ): React.ReactNode => {
    const [source, target] = langPair.pairName.split('-');
    const icon = <MoveRight className="size-4" />;

    const content = (() => {
      switch (direction) {
        case 'sourceToTarget': {
          return (
            <>
              {source}
              {icon}
              {target}
            </>
          );
        }
        case 'targetToSource': {
          return (
            <>
              {target}
              {icon}
              {source}
            </>
          );
        }
        case 'random':
          return 'Random';
      }
    })();
    return (
      <FieldTitle className="justify-center text-nowrap">{content}</FieldTitle>
    );
  };

  return (
    <FieldSet>
      <FieldLegend>Translation Direction</FieldLegend>
      <RadioGroup
        name="direction"
        defaultValue={initialDirection}
        orientation="horizontal"
        className="flex gap-2"
      >
        {DirectionSettingEnum.map((val) => (
          <FieldLabel key={val} htmlFor={`dir-${val}`}>
            <Field orientation="horizontal">
              <FieldContent className="items-center">
                {createDirectionFieldTitle(val)}
              </FieldContent>
              <RadioGroupItem
                value={val}
                id={`dir-${val}`}
                className="hidden"
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
