'use client';

import { TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import {
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export function QuestionLimitFieldSet({
  initialLimit,
}: {
  initialLimit: TestSettings['questionLimit'];
}) {
  const defaultValue = initialLimit ? initialLimit : undefined;
  const [questionLimitSet, setQuestionLimitSet] = useState(!!defaultValue);

  return (
    <FieldSet className="flex-row items-start justify-between">
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
          type="number"
          defaultValue={defaultValue}
          disabled={!questionLimitSet}
          className="w-17 text-center"
        />
      </div>
    </FieldSet>
  );
}
