import { useLanguagePairContext } from '@/contexts/language-pair';
import { Direction } from '@/lib/types/test';

interface QuestionPanelProps {
  questionWord: string;
  direction: Direction;
}

export function QuestionPanel({ questionWord, direction }: QuestionPanelProps) {
  const { sourceLanguage, targetLanguage } =
    useLanguagePairContext().activePair;

  if (direction === 'sourceToTarget') {
    return (
      <SourceQuestion
        targetLanguage={targetLanguage}
        questionWord={questionWord}
      />
    );
  } else {
    return (
      <TargetQuestion
        sourceLanguage={sourceLanguage}
        questionWord={questionWord}
      />
    );
  }
}

const containerStyle = 'text-center text-2xl space-y-4 cursor-default';
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
    <div className={containerStyle}>
      <p>What does</p>
      <span className={questionWordStyle}>{questionWord}</span>
      <p>
        mean in <strong className="capitalize">{targetLanguage}</strong>?
      </p>
    </div>
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
    <div className={containerStyle}>
      <p>How do you say</p>
      <span className={questionWordStyle}>{questionWord}</span>
      <p>
        in <strong className="capitalize">{sourceLanguage}</strong>?
      </p>
    </div>
  );
}
