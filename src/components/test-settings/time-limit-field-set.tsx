'use client';

import { VALIDATION_LIMITS } from '@/lib/constants/validation';
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
          className="w-17 text-center"
          name="timeLimitMins"
          type="number"
          min={1}
          max={VALIDATION_LIMITS.MAX_TIME_MINS}
          defaultValue={defaultValue}
          disabled={!timeLimitSet}
          required
          autoComplete="off"
        />
      </div>
    </FieldSet>
  );
}
