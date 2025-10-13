'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { createVocabAction, updateVocabAction } from '@/lib/actions/vocab';
import { FormResult } from '@/lib/types/types';
import { VocabItem } from '@/lib/types/vocab';
import { getFormValue } from '@/lib/utils';
import Form from 'next/form';
import { useActionState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type VocabFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit';
      initialData: VocabItem;
    };

export function VocabForm(props: VocabFormProps) {
  const editMode = props.mode === 'edit';

  const { sourceLanguage, targetLanguage } =
    useLanguagePairContext().activePair;

  // Initial form data based on mode - used for initial state and default input values
  const createInitialFormData = (vocabItem?: VocabItem): FormData => {
    const formData = new FormData();

    if (vocabItem) {
      formData.set('source', vocabItem.source);
      formData.set('target', vocabItem.target);
    }

    return formData;
  };

  const initialState: FormResult<VocabItem> = {
    success: false,
    error: '',
    formData: createInitialFormData(editMode ? props.initialData : undefined),
  };

  const action = editMode
    ? updateVocabAction.bind(null, props.initialData.id)
    : createVocabAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Set fallback formData for use in input default values
  const formData = !state.success ? state.formData : new FormData();

  return (
    <div>
      <Form action={formAction} className="grid space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="source" className="capitalize">
            {sourceLanguage}
          </Label>
          <Input
            id="source"
            name="source"
            defaultValue={getFormValue(formData, 'source')}
            required
            autoComplete="off"
            autoFocus
          />
          {!state.success && state.fieldErrors?.source && (
            <p className="text-destructive text-sm">
              {state.fieldErrors.source.join('. ')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="target" className="capitalize">
            {targetLanguage}
          </Label>
          <Input
            id="target"
            name="target"
            defaultValue={getFormValue(formData, 'target')}
            required
            autoComplete="off"
          />
          {!state.success && state.fieldErrors?.target && (
            <p className="text-destructive text-sm">
              {state.fieldErrors.target.join('. ')}
            </p>
          )}
        </div>

        {!state.success && !state.fieldErrors && (
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
      </Form>
    </div>
  );
}
