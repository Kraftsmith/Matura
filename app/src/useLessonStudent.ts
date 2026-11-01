import { useState } from 'react';
import { students } from './users';

const STORAGE_KEY = 'matura.lessonStudent';

const readStudent = (): string | undefined => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return students.some((s) => s.id === saved) ? (saved as string) : undefined;
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
  const [student, setStudent] = useState(readStudent);
  const choose = (id: string | undefined) => {
    writeStudent(id);
    setStudent(id);
  };
  return [enabled ? student : undefined, choose] as const;
};
