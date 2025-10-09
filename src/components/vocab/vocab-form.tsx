'use client';

import { createVocabAction, updateVocabAction } from '@/lib/actions/vocab';
import { Result } from '@/lib/types/types';
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

  const initialState: Result<VocabItem> = {
    success: false,
    error: '',
  };

  const action = editMode
    ? updateVocabAction.bind(null, props.initialData.id)
    : createVocabAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div>
      <Form action={formAction} className="space-y-8">
        <div className="grid gap-2">
          <Label htmlFor="source">{source}</Label>
          <Input
            id="source"
            name="source"
            defaultValue={editMode ? props.initialData.source : ''}
            required
            autoFocus
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="target">{target}</Label>
          <Input
            id="target"
            name="target"
            defaultValue={editMode ? props.initialData.target : ''}
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting' : 'Submit'}
        </Button>
      </Form>
    </div>
  );
}
