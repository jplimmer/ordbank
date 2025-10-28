'use client';

import { FormResult } from '@/lib/types/common';
import { LanguagePair } from '@/lib/types/language-pair';
import { generatePairName, getFormValue } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';

interface FormProps {
  state: FormResult<LanguagePair>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

export function Form({ state, formAction, isPending }: FormProps) {
  const inputValues = !state.success
    ? {
        sourceLanguage: getFormValue(state.formData, 'source-language'),
        targetLanguage: getFormValue(state.formData, 'target-language'),
      }
    : null;

  // States for computing pair name
  const [sourceName, setSourceName] = useState(
    inputValues?.sourceLanguage ?? ''
  );
  const [targetName, setTargetName] = useState(
    inputValues?.targetLanguage ?? ''
  );
  const pairName = generatePairName(sourceName, targetName);

  return (
    <form action={formAction} className="grid space-y-6">
      <Field>
        <FieldContent>
          <FieldLabel htmlFor="source-language">Source language</FieldLabel>
          <FieldDescription>The language you are learning</FieldDescription>
        </FieldContent>
        <Input
          id="source-language"
          name="source-language"
          defaultValue={inputValues?.sourceLanguage ?? ''}
          onChange={(e) => setSourceName(e.target.value)}
          required
          autoComplete="off"
        />
        {!state.success && state.fieldErrors?.sourceLanguage && (
          <FieldError>{state.fieldErrors.sourceLanguage.join('. ')}</FieldError>
        )}
      </Field>

      <Field>
        <FieldContent>
          <FieldLabel htmlFor="target-language">Target language</FieldLabel>
          <FieldDescription>The language you already know</FieldDescription>
        </FieldContent>
        <Input
          id="target-language"
          name="target-language"
          defaultValue={inputValues?.targetLanguage ?? ''}
          onChange={(e) => setTargetName(e.target.value)}
          required
          autoComplete="off"
        />
        {!state.success && state.fieldErrors?.targetLanguage && (
          <FieldError>{state.fieldErrors.targetLanguage.join('. ')}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="pair-name">Pair name</FieldLabel>
        <Input
          id="pair-name"
          name="pair-name"
          readOnly
          value={pairName}
          className="pointer-events-none cursor-not-allowed opacity-50"
        />
      </Field>

      {!state.success && state.error && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-fit justify-self-end"
      >
        {isPending ? 'Saving changes...' : 'Save changes'}
      </Button>
    </form>
  );
}
