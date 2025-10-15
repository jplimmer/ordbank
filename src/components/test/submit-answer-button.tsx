import { processAnswer } from '@/lib/actions/test';
import { Answer } from '@/lib/types/test';
import { Button } from '../ui/button';

export function SubmitAnswerButton({ vocabId, direction, answer }: Answer) {
  const handleSubmit = () => {
    if (!answer) {
      alert('Please select an answer');
      return;
    }
    processAnswer({ vocabId, direction, answer });
  };

  return (
    <Button onClick={handleSubmit} className="justify-self-center">
      Submit
    </Button>
  );
}
