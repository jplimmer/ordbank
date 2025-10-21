'use client';

import { VALIDATION_LIMITS } from '@/lib/constants/validation';
import { TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import { Field, FieldContent, FieldDescription, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export function QuestionLimitField({
  initialLimit,
}: {
  initialLimit: TestSettings['questionLimit'];
}) {
  const defaultValue = initialLimit ? initialLimit : undefined;
  const [questionLimitSet, setQuestionLimitSet] = useState(!!defaultValue);

  return (
    <Field
      orientation="horizontal"
      className="flex-row items-start justify-between"
    >
      <FieldContent>
        <FieldLabel className="font-medium text-base">
          Number of questions
        </FieldLabel>
        <FieldDescription className="text-pretty">
          If turned off, the number of questions is unlimited.
        </FieldDescription>
      </FieldContent>
      <div className="flex items-center gap-4">
        <Switch
          checked={questionLimitSet}
          onCheckedChange={setQuestionLimitSet}
        />
        <Input
          className="w-17 text-center"
          name="questionLimit"
          type="number"
          min={1}
          max={VALIDATION_LIMITS.MAX_QUESTIONS}
          defaultValue={defaultValue}
          disabled={!questionLimitSet}
          required
          autoComplete="off"
        />
      </div>
    </Field>
  );
}
