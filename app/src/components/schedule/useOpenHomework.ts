import { myHomeworkProgress } from '../../homework';
import type { MyHomework } from '../../schedule';
import { useNow } from '../../useNow';
import { useProgress } from '../../useProgress';
import { useSchedule } from '../../useSchedule';

/** Homework the learner still has to show, or finished and not yet past its deadline. Earliest deadline first. */
export const useOpenHomework = (): MyHomework[] => {
  const { myHomework } = useSchedule();
  const { state } = useProgress();
  const now = useNow();
  return myHomework.filter((h) => !myHomeworkProgress(h, state, now).complete || new Date(h.dueAt).getTime() > now).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
};
