import { formatTime } from '@/lib/utils';
import { Clock8, TimerIcon } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isCountingDown?: boolean;
  className?: string;
  iconStyle?: string;
}

export function Timer({
  seconds,
  isCountingDown,
  className,
  iconStyle,
}: TimerProps) {
  const displayTime = formatTime(seconds);

  const isLowTime = isCountingDown && seconds <= 60 && seconds > 0;

  return (
    <div
      className={`flex gap-2 items-center text-sm ${isLowTime ? 'text-red-500' : ''} ${className}`}
    >
      {isCountingDown ? (
        <TimerIcon className={`size-4 ${iconStyle}`} />
      ) : (
        <Clock8 className={`size-4 ${iconStyle}`} />
      )}
      {displayTime}
    </div>
  );
}
