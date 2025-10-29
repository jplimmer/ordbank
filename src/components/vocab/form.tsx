'use client';

import { useActivePair } from '@/contexts/language-pair';
import { FormResult } from '@/lib/types/common';
import { VocabItem } from '@/lib/types/vocab';
import { getFormValue } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface FormProps {
  state: FormResult<VocabItem>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  showSaveAndAddAnother?: boolean;
}

export function Form({
  state,
  formAction,
  isPending,
  showSaveAndAddAnother = false,
}: FormProps) {
  const { sourceLanguage, targetLanguage } = useActivePair();

  // If 'Save and Add Another' button visible, track which
  // button was pressed for loading state
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    setClickedButton(submitter.value || 'save');
  };

  const inputValues = !state.success
    ? {
        source: getFormValue(state.formData, 'source'),
        target: getFormValue(state.formData, 'target'),
      }
    : null;

  return (
    <div>
      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="grid space-y-6"
      >
        <Field>
          <FieldLabel htmlFor="source" className="capitalize">
            {sourceLanguage}
          </FieldLabel>
          <Input
            id="source"
            name="source"
            defaultValue={inputValues?.source ?? ''}
            required
            autoComplete="off"
          />
          {!state.success && state.fieldErrors?.source && (
            <FieldError>{state.fieldErrors.source.join('. ')}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="target" className="capitalize">
            {targetLanguage}
          </FieldLabel>
          <Input
            id="target"
            name="target"
            defaultValue={inputValues?.target ?? ''}
            required
            autoComplete="off"
          />
          {!state.success && state.fieldErrors?.target && (
            <FieldError>{state.fieldErrors.target.join('. ')}</FieldError>
          )}
        </Field>

        {!state.success && state.error && !state.fieldErrors && (
          <p className="text-destructive text-sm">{state.error}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {showSaveAndAddAnother && (
            <Button
              type="submit"
              name="intent"
              value="save-and-add-another"
              disabled={isPending}
              variant="secondary"
            >
              {isPending && clickedButton === 'save-and-add-another'
                ? 'Saving...'
                : 'Save & Add Another'}
            </Button>
          )}
          <Button
            type="submit"
            name="intent"
            value="save"
            disabled={isPending}
            className="sm:min-w-[170px] sm:ml-auto"
          >
            {isPending && clickedButton === 'save' ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
