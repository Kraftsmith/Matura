import { useEffect, useState } from 'react';

/** The current time, refreshed on a timer, so "in progress" and "overdue" change while the page stays open. */
export const useNow = (everyMs = 60_000): number => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
};
