import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  timeLimitSecs?: number;
  onTimeExpired?: () => void;
}

export const useTimer = ({
  timeLimitSecs,
  onTimeExpired,
}: UseTimerOptions = {}) => {
  const [seconds, setSeconds] = useState(timeLimitSecs ?? 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isCountingDown = timeLimitSecs !== undefined;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = isCountingDown ? prev - 1 : prev + 1;

        // Check if time expired (countdown only)
        if (isCountingDown && next <= 0) {
          onTimeExpired?.();
          return 0;
        }

        return next;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCountingDown, onTimeExpired]);

  const reset = useCallback(() => {
    setSeconds(timeLimitSecs ?? 0);
  }, [timeLimitSecs]);

  return { seconds, reset };
};
