import { AnswerModeSettingEnum, TestSettings } from '@/lib/types/test';
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../ui/field';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function AnswerModeFieldSet({
  initialAnswerMode,
}: {
  initialAnswerMode: TestSettings['answerMode'];
}) {
  const createAnswerModeFieldTitle = (
    mode: TestSettings['answerMode']
  ): React.ReactNode => {
    const content = (() => {
      switch (mode) {
        case 'multipleChoice':
          return 'Mult. Choice';
        case 'typed':
          return 'Free text';
        case 'random':
          return 'Random';
      }
    })();

    return (
      <FieldTitle className="justify-center whitespace-nowrap">
        {content}
      </FieldTitle>
    );
  };

  return (
    <FieldSet>
      <FieldLegend>Answer type</FieldLegend>
      <RadioGroup
        defaultValue={initialAnswerMode}
        orientation="horizontal"
        className="flex gap-2"
      >
        {AnswerModeSettingEnum.map((val) => (
          <FieldLabel key={val} htmlFor={`am-${val}`}>
            <Field orientation="horizontal" className="">
              {createAnswerModeFieldTitle(val)}
              <RadioGroupItem value={val} id={`am-${val}`} className="hidden" />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
