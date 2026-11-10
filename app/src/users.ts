import type { ProgressState } from './progress-context';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
}

export type ExamLevel = 'podstawowa' | 'rozszerzona';

export interface ExamPlan {
  examDate?: string;
  level?: ExamLevel;
  goal?: string;
}

/** The signed-in user, as the server sees them. The role is never decided in the browser. */
export interface AccountUser extends UserProfile, ExamPlan {
  email: string;
  uiLang: 'pl' | 'en';
  translationLang: 'pl' | 'ru';
  onboarded: boolean;
  termsAccepted: boolean;
  teacher?: { name: string };
  /** Mail at once when the teacher writes (a learner's setting). */
  notifyMailMessage: boolean;
  /** The daily summary by mail. */
  notifyMailDigest: boolean;
}

/** A learner who joined the teacher's class. */
export interface ClassStudent extends UserProfile, ExamPlan {
  email: string;
  progress: ProgressState;
}

/** Whole days until the exam, or undefined once it has passed. */
export const daysUntil = (examDate: string | undefined): number | undefined => {
  if (!examDate) return undefined;
  const days = Math.ceil((new Date(`${examDate}T00:00:00`).getTime() - Date.now()) / 86_400_000);
  return days >= 0 ? days : undefined;
};

export const roleLabel: Record<UserRole, string> = {
  student: 'Uczeń',
  teacher: 'Nauczyciel',
};
