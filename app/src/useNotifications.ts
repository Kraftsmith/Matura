import { useContext } from 'react';
import { NotificationsContext, type NotificationsValue } from './notifications-context';

export const useNotifications = (): NotificationsValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
};
