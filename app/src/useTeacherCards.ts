import { useContext } from 'react';
import { TeacherCardsContext, type TeacherCardsValue } from './teacher-cards-context';

export const useTeacherCards = (): TeacherCardsValue => {
  const ctx = useContext(TeacherCardsContext);
  if (!ctx) throw new Error('useTeacherCards must be used inside TeacherCardsProvider');
  return ctx;
};
