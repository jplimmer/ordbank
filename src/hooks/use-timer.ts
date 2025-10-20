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
  const hasExpiredRef = useRef(false);

  const isCountingDown = timeLimitSecs !== undefined;

  // Timer counting
  useEffect(() => {
    setSeconds(timeLimitSecs ?? 0);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = isCountingDown ? prev - 1 : prev + 1;
        return isCountingDown && next <= 0 ? 0 : next;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLimitSecs, isCountingDown]);

  // Timer expiration
  useEffect(() => {
    if (
      isCountingDown &&
      seconds <= 0 &&
      !hasExpiredRef.current &&
      timeLimitSecs
    ) {
      hasExpiredRef.current = true;
      onTimeExpired?.();
    }
  }, [seconds, isCountingDown, onTimeExpired, timeLimitSecs]);

  // Timer reset
  const reset = useCallback(() => {
    setSeconds(timeLimitSecs ?? 0);
    hasExpiredRef.current = false;
  }, [timeLimitSecs]);

  return { seconds, reset };
};
