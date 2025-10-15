import { useLanguagePairContext } from '@/contexts/language-pair';
import { Direction } from '@/lib/types/test';
import { RefObject } from 'react';

interface QuestionPanelProps {
  questionWord: string;
  direction: Direction;
  ref?: RefObject<HTMLDivElement | null>;
}

export function QuestionPanel({
  questionWord,
  direction,
  ref,
}: QuestionPanelProps) {
  const { sourceLanguage, targetLanguage } =
    useLanguagePairContext().activePair;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="text-center text-2xl space-y-4 cursor-default focus:outline-none"
    >
      {direction === 'sourceToTarget' ? (
        <SourceQuestion
          targetLanguage={targetLanguage}
          questionWord={questionWord}
        />
      ) : (
        <TargetQuestion
          sourceLanguage={sourceLanguage}
          questionWord={questionWord}
        />
      )}
    </div>
  );
}

const questionWordStyle =
  'inline-block text-4xl font-semibold border rounded-md px-6 py-3';

function SourceQuestion({
  targetLanguage,
  questionWord,
}: {
  targetLanguage: string;
  questionWord: string;
}) {
  return (
    <>
      <p>What does</p>
      <span className={questionWordStyle}>{questionWord}</span>
      <p>
        mean in <strong className="capitalize">{targetLanguage}</strong>?
      </p>
    </>
  );
}

function TargetQuestion({
  sourceLanguage,
  questionWord,
}: {
  sourceLanguage: string;
  questionWord: string;
}) {
  return (
    <>
      <p>How do you say</p>
      <span className={questionWordStyle}>{questionWord}</span>
      <p>
        in <strong className="capitalize">{sourceLanguage}</strong>?
      </p>
    </>
  );
}
