import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError } from './accountApi';
import { ScheduleContext, type ScheduleValue } from './schedule-context';
import type { Homework, Lesson, MyHomework, MyLesson } from './schedule';
import { addMyTick, fetchMyHomework, fetchMyLessons, fetchOverview, removeMyTick } from './scheduleApi';
import { useUser } from './useUser';

/** A learner's page checks for new homework now and then: the teacher may be setting it during the lesson. */
const POLL_MS = 60_000;

const NO_LESSONS: Lesson[] = [];
const NO_HOMEWORK: Homework[] = [];

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, markSignedOut } = useUser();
  const isTeacher = user.role === 'teacher';
  const [lessons, setLessons] = useState<Lesson[]>(NO_LESSONS);
  const [homework, setHomework] = useState<Homework[]>(NO_HOMEWORK);
  const [myLessons, setMyLessons] = useState<MyLesson[]>([]);
  const [myHomework, setMyHomework] = useState<MyHomework[]>([]);
  const [status, setStatus] = useState<ScheduleValue['status']>('loading');
  // A slow answer to an older request must not overwrite a newer one.
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    const mine = ++generation.current;
    try {
      if (isTeacher) {
        const overview = await fetchOverview();
        if (mine !== generation.current) return;
        setLessons(overview.lessons);
        setHomework(overview.homework);
      } else {
        const [l, h] = await Promise.all([fetchMyLessons(), fetchMyHomework()]);
        if (mine !== generation.current) return;
        setMyLessons(l);
        setMyHomework(h);
      }
      setStatus('ready');
    } catch (e) {
      if (mine !== generation.current) return;
      if (e instanceof ApiError && (e.status === 401 || (isTeacher && e.status === 404))) markSignedOut();
      else setStatus('failed');
    }
  }, [isTeacher, markSignedOut]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  useEffect(() => {
    if (isTeacher) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [isTeacher, refresh]);

  const tickMine = useCallback(
    async (itemId: string, done: boolean) => {
      const now = new Date().toISOString();
      // Shown at once; the server's answer replaces it.
      setMyHomework((list) => list.map((h) => ({ ...h, items: h.items.map((i) => (i.id === itemId ? { ...i, tick: done ? { by: 'student', doneAt: now } : undefined } : i)) })));
      try {
        await (done ? addMyTick(itemId) : removeMyTick(itemId));
      } finally {
        await refresh();
      }
    },
    [refresh],
  );

  const value = useMemo<ScheduleValue>(
    () => ({ lessons, homework, myLessons, myHomework, status, refresh, tickMine }),
    [lessons, homework, myLessons, myHomework, status, refresh, tickMine],
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
