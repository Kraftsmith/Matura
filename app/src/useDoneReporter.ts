import { useCallback, useEffect, useRef } from 'react';
import { ApiError } from './accountApi';
import { myHomeworkProgress } from './homework';
import { reportHomeworkDone } from './notificationsApi';
import type { ProgressState } from './progress-context';
import type { MyHomework } from './schedule';

/**
 * Tells the server when the learner's own work completes a homework (Spec - Powiadomienia §7.1). Only the learner's
 * own saves and ticks count: a teacher's tick arriving with a poll says nothing new to the teacher. Ids wait in
 * localStorage until the server has answered, so a closed tab does not lose the signal.
 */

const queueKey = (userId: string) => `matura.doneQueue.${userId}`;

const readQueue = (userId: string): string[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(queueKey(userId)) ?? '[]') as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

const writeQueue = (userId: string, ids: string[]) => {
  try {
    if (ids.length === 0) window.localStorage.removeItem(queueKey(userId));
    else window.localStorage.setItem(queueKey(userId), JSON.stringify(ids));
  } catch {
    /* storage unavailable: the id lives in this tab only */
  }
};

/** Ids of the homework the learner has finished, by their own count. */
export const completedIds = (homework: MyHomework[], state: ProgressState, now: number): Set<string> =>
  new Set(homework.filter((h) => h.items.length > 0 && myHomeworkProgress(h, state, now).complete).map((h) => h.id));

interface Options {
  enabled: boolean;
  userId: string;
  homework: MyHomework[];
  state: ProgressState;
  /** Waits for the progress to reach the server, so the server's check sees the work. */
  flush: () => Promise<boolean>;
  /** The learner's own tick happened just now (set by the provider around tickMine). */
  ownAction: React.RefObject<boolean>;
}

export const useDoneReporter = ({ enabled, userId, homework, state, flush, ownAction }: Options): void => {
  const previous = useRef<Set<string>>(undefined);
  const prevState = useRef(state);
  const sending = useRef(false);

  const send = useCallback(async () => {
    if (sending.current) return;
    sending.current = true;
    try {
      for (const id of readQueue(userId)) {
        try {
          await reportHomeworkDone(id);
          writeQueue(userId, readQueue(userId).filter((x) => x !== id));
        } catch (e) {
          // 409: the server does not see the work yet; the id stays for the next try. 404: the homework is gone.
          if (e instanceof ApiError && e.status === 404) writeQueue(userId, readQueue(userId).filter((x) => x !== id));
          else if (!(e instanceof ApiError && e.status === 409)) break;
        }
      }
    } finally {
      sending.current = false;
    }
  }, [userId]);

  useEffect(() => {
    if (!enabled) return;
    const now = Date.now();
    const current = completedIds(homework, state, now);
    const before = previous.current;
    const stateChanged = prevState.current !== state;
    prevState.current = state;
    previous.current = current;
    if (!before) return;
    const own = stateChanged || ownAction.current;
    const fresh = [...current].filter((id) => !before.has(id));
    if (fresh.length === 0 || !own) return;
    writeQueue(userId, [...new Set([...readQueue(userId), ...fresh])]);
    void flush().then(send);
  }, [enabled, homework, state, userId, flush, ownAction, send]);

  // What an earlier visit left in the queue goes out once the page knows its homework.
  useEffect(() => {
    if (!enabled || homework.length === 0 || readQueue(userId).length === 0) return;
    void flush().then(send);
  }, [enabled, homework.length, userId, flush, send]);
};
