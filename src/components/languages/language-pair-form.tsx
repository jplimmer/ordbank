'use client';

import {
  createLanguagePairAction,
  updateLanguagePairAction,
} from '@/lib/actions/language-pairs';
import { FormResult } from '@/lib/types/common';
import { LanguagePair } from '@/lib/types/language-pair';
import { generatePairName, getFormValue } from '@/lib/utils';
import { useActionState, useState } from 'react';
import { Button } from '../ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';

type LanguagePairFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit';
      initialData: LanguagePair;
    };

export function LanguagePairForm(props: LanguagePairFormProps) {
  const editMode = props.mode === 'edit';

  // Initial form data based on mode - used for initial state and default input values
  const createInitialFormData = (languagePair?: LanguagePair): FormData => {
    const formData = new FormData();

    if (languagePair) {
      formData.set('source', languagePair.sourceLanguage);
      formData.set('target', languagePair.targetLanguage);
    }

    return formData;
  };

  const initialState: FormResult<LanguagePair> = {
    success: false,
    error: '',
    formData: createInitialFormData(editMode ? props.initialData : undefined),
  };

  const action = editMode
    ? updateLanguagePairAction.bind(null, props.initialData.id)
    : createLanguagePairAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Set fallback formData for use in input default values
  const formData = !state.success ? state.formData : new FormData();

  // States for computing pair name
  const [sourceName, setSourceName] = useState(
    getFormValue(formData, 'source')
  );
  const [targetName, setTargetName] = useState(
    getFormValue(formData, 'target')
  );
  const pairName = generatePairName(sourceName, targetName);

  return (
    <div>
      <form action={formAction} className="grid space-y-6">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="source-language">Source language</FieldLabel>
            <FieldDescription>The language you are learning</FieldDescription>
          </FieldContent>
          <Input
            id="source-language"
            name="source-language"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            required
            autoComplete="off"
            autoFocus
          />
          {!state.success && state.fieldErrors?.source && (
            <FieldError>{state.fieldErrors.source.join('. ')}</FieldError>
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
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            required
            autoComplete="off"
          />
          {!state.success && state.fieldErrors?.target && (
            <FieldError>{state.fieldErrors.target.join('. ')}</FieldError>
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
          {editMode
            ? isPending
              ? 'Saving changes...'
              : 'Save changes'
            : isPending
              ? 'Submitting...'
              : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
