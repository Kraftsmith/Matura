import { createContext } from 'react';
import type { Homework, Lesson, MyHomework, MyLesson } from './schedule';

export interface ScheduleValue {
  /** Teacher: lessons around today and the class's recent homework. Empty for a learner. */
  lessons: Lesson[];
  homework: Homework[];
  /** Learner: their own lessons and homework. Empty for the teacher. */
  myLessons: MyLesson[];
  myHomework: MyHomework[];
  status: 'loading' | 'ready' | 'failed';
  /** Fetches everything again, after a change or when the tab comes back. */
  refresh: () => Promise<void>;
  /** Learner: tick or untick a homework item by hand. */
  tickMine: (itemId: string, done: boolean) => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleValue | null>(null);
