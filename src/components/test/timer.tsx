import { formatTime } from '@/lib/utils';
import { Clock8, TimerIcon } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isCountingDown?: boolean;
  lowTime?: number;
  className?: string;
  iconStyle?: string;
}

export function Timer({
  seconds,
  isCountingDown,
  lowTime = 10,
  className,
  iconStyle,
}: TimerProps) {
  const displayTime = formatTime(seconds);

  const isLowTime = isCountingDown && seconds < lowTime && seconds > 0;

  return (
    <div
      className={`flex gap-2 items-center text-sm ${isLowTime ? 'text-red-600' : ''} ${className}`}
    >
      {isCountingDown ? (
        <TimerIcon className={`size-4 ${iconStyle}`} />
      ) : (
        <Clock8 className={`size-4 ${iconStyle}`} />
      )}
      <span className="relative top-[0.7px]">{displayTime}</span>
    </div>
  );
}
