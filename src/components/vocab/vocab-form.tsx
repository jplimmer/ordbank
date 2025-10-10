'use client';

import { createVocabAction, updateVocabAction } from '@/lib/actions/vocab';
import { FormResult } from '@/lib/types/types';
import { VocabItem } from '@/lib/types/vocab';
import Form from 'next/form';
import { useActionState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// TO DO - update column names using languagePair context/url
const source = 'Swedish';
const target = 'English';

type VocabFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit';
      initialData: VocabItem;
    };

export function VocabForm({ props }: { props: VocabFormProps }) {
  const editMode = props.mode === 'edit';

  const initialState: FormResult<VocabItem> = {
    success: false,
    error: '',
  };

  const action = editMode
    ? updateVocabAction.bind(null, props.initialData.id)
    : createVocabAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div>
      <Form action={formAction} className="grid space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="source">{source}</Label>
          <Input
            id="source"
            name="source"
            defaultValue={editMode ? props.initialData.source : ''}
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
          <Label htmlFor="target">{target}</Label>
          <Input
            id="target"
            name="target"
            defaultValue={editMode ? props.initialData.target : ''}
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
