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

export function TimeLimitFieldSet({
  initialLimit,
}: {
  initialLimit: TestSettings['timeLimitMins'];
}) {
  const defaultValue = initialLimit ? initialLimit : undefined;
  const [timeLimitSet, setTimeLimitSet] = useState(!!defaultValue);

  return (
    <FieldSet className="flex-row items-start justify-between">
      <FieldContent>
        <FieldLabel className="font-medium text-base">
          Time limit (mins)
        </FieldLabel>
        <FieldDescription className="text-pretty">
          If turned off, the test duration is unlimited.
        </FieldDescription>
      </FieldContent>
      <div className="flex items-center gap-4">
        <Switch checked={timeLimitSet} onCheckedChange={setTimeLimitSet} />
        <Input
          type="number"
          defaultValue={defaultValue}
          disabled={!timeLimitSet}
          className="w-17 text-center"
        />
      </div>
    </FieldSet>
  );
}
