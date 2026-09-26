import { useTimer } from '@/hooks/use-timer';
import { Timer } from '../ui/timer';

interface TestTimerProps {
  timeLimitMins: number | null;
  onTimeExpired: () => void;
  className?: string;
}

// Owns the timer state so it starts fresh whenever a test is mounted
export function TestTimer({
  timeLimitMins,
  onTimeExpired,
  className,
}: TestTimerProps) {
  const { seconds } = useTimer({
    timeLimitSecs: timeLimitMins ? timeLimitMins * 60 : undefined,
    onTimeExpired,
  });

  return (
    <Timer
      seconds={seconds}
      isCountingDown={timeLimitMins !== null}
      className={className}
    />
  );
}
