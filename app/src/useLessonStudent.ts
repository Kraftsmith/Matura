import { useCallback, useState } from 'react';
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
  const [student, setStudent] = useState(readStudent);
  const choose = useCallback((id: string | undefined) => {
    writeStudent(id);
    setStudent(id);
  }, []);
  return [enabled && students.some((s) => s.id === student) ? student : undefined, choose] as const;
};
