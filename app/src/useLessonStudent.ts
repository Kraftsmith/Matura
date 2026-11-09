import { useCallback, useEffect, useState } from 'react';
import { useUser } from './useUser';

const STORAGE_KEY = 'matura.lessonStudent';

const readStudent = (): string | undefined => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const writeStudent = (id: string | undefined) => {
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: the choice lasts until reload */
  }
};

/** Whose deck the teacher's new cards go to. Undefined means the teacher's own. */
export const useLessonStudent = (enabled: boolean) => {
  const { students } = useUser();
  // Read in an effect, not in the initialiser: the same hook runs where the component is rendered to HTML without a browser.
  const [student, setStudent] = useState<string | undefined>();
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setStudent(readStudent());
  }, []);
  const choose = useCallback((id: string | undefined) => {
    writeStudent(id);
    setStudent(id);
  }, []);
  return [enabled && students.some((s) => s.id === student) ? student : undefined, choose] as const;
};
