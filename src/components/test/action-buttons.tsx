import { RefObject } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface ActionButtonProps {
  isAnswered: boolean;
  onSubmit: () => void;
  onNext: () => void;
  isLoading: boolean;
  onEnd?: () => void;
  showEndButton?: boolean;
  nextButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function ActionButtons({
  isAnswered,
  onSubmit,
  onNext,
  isLoading,
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
          disabled={isLoading}
          className="text-lg py-5"
        >
          {isLoading ? <Spinner /> : 'Submit'}
        </Button>
      ) : (
        <div className="flex gap-2 w-full">
          {!showEndButton && (
            <Button
              variant="outline"
              onClick={onEnd}
              disabled={isLoading}
              className={`${buttonStyle}`}
            >
              End test
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={isLoading}
            className={`${buttonStyle} flex-1`}
            ref={nextButtonRef}
          >
            {isLoading ? <Spinner /> : 'Next question'}
          </Button>
        </div>
      )}
    </>
  );
}
