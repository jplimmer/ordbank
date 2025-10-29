import { useActivePair } from '@/contexts/language-pair';
import { FormResult } from '@/lib/types/common';
import { VocabItem } from '@/lib/types/vocab';
import { getFormValue } from '@/lib/utils';
import { Button } from '../ui/button';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface FormProps {
  state: FormResult<VocabItem>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

export function Form({ state, formAction, isPending }: FormProps) {
  const { sourceLanguage, targetLanguage } = useActivePair();

  const inputValues = !state.success
    ? {
        source: getFormValue(state.formData, 'source'),
        target: getFormValue(state.formData, 'target'),
      }
    : null;

  return (
    <div>
      <form action={formAction} className="grid space-y-6">
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

        <Button
          type="submit"
          disabled={isPending}
          className="min-w-[150px] justify-self-end"
        >
          {isPending ? 'Saving changes...' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}
