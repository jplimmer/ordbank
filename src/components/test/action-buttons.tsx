import { RefObject } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface ActionButtonProps {
  isAnswered: boolean;
  onSubmit: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isLoadingNext: boolean;
  onEnd?: () => void;
  showEndButton?: boolean;
  nextButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function ActionButtons({
  isAnswered,
  onSubmit,
  onNext,
  isSubmitting,
  isLoadingNext,
  onEnd,
  showEndButton = false,
  nextButtonRef,
}: ActionButtonProps) {
  const buttonStyle = 'text-lg py-5';

  return (
    <>
      {!isAnswered ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="text-lg py-5"
        >
          {isSubmitting ? <Spinner /> : 'Submit'}
        </Button>
      ) : (
        <div className="flex gap-2 w-full">
          {!showEndButton && (
            <Button
              variant="outline"
              onClick={onEnd}
              className={`${buttonStyle}`}
            >
              End Test
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={isLoadingNext}
            className={`${buttonStyle} flex-1`}
            ref={nextButtonRef}
          >
            {isLoadingNext ? <Spinner /> : 'Next question'}
          </Button>
        </div>
      )}
    </>
  );
}
