export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
}

/** Fixed roster: two learners preparing for the exam and one teacher who follows their progress. */
export const users: UserProfile[] = [
  { id: 'maria', name: 'Maria', initials: 'M', role: 'student' },
  { id: 'evgeny', name: 'Evgeny', initials: 'E', role: 'student' },
  { id: 'teacher', name: 'Nauczyciel', initials: 'N', role: 'teacher' },
];

export const students = users.filter((u) => u.role === 'student');

export const DEFAULT_USER_ID = users[0].id;

export const findUser = (id: string | null | undefined): UserProfile | undefined => users.find((u) => u.id === id);

export const roleLabel: Record<UserRole, string> = {
  student: 'Uczeń',
  teacher: 'Nauczyciel',
};
