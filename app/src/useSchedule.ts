import { useContext } from 'react';
import { ScheduleContext, type ScheduleValue } from './schedule-context';

export const useSchedule = (): ScheduleValue => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule must be used inside ScheduleProvider');
  return ctx;
};
