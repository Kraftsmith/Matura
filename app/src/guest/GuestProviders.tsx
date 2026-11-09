import React, { useMemo } from 'react';
import { SettingsProvider } from '../settings';
import { UserContext, type UserValue } from '../user-context';
import { TeacherCardsContext, type TeacherCardsValue } from '../teacher-cards-context';
import { FlashcardDialogProvider } from '../components/FlashcardDialogProvider';
import { GuestProgressProvider, GUEST_USER_ID } from './guestProgress';
import type { AccountUser } from '../users';

const GUEST_USER: AccountUser = {
  id: GUEST_USER_ID,
  name: 'Gość',
  initials: 'G',
  role: 'student',
  email: '',
  uiLang: 'pl',
  translationLang: 'pl',
  onboarded: true,
  termsAccepted: true,
};

const noop = async () => {};
const noTeacherCards = {};

/** No class, no server: the teacher's cards never reach a guest. */
const NO_TEACHER_CARDS: TeacherCardsValue = {
  cardsOf: () => noTeacherCards,
  arrived: [],
  clearArrived: () => {},
  setLive: () => {},
  createCard: () => Promise.reject(new Error('guest')),
  updateCard: () => Promise.reject(new Error('guest')),
  removeCard: () => {},
  undoRemove: () => {},
};

interface GuestProvidersProps {
  /** Topics open on the site (Spec - Landing §8). */
  allowedModules: readonly string[];
  children?: React.ReactNode;
}

/**
 * Everything a section component needs to run on the public site without an account and without a single
 * request: settings, a guest user, no teacher cards, progress in this browser, and the flashcard dialog.
 */
export const GuestProviders: React.FC<GuestProvidersProps> = ({ allowedModules, children }) => {
  const user = useMemo<UserValue>(
    () => ({ user: GUEST_USER, students: [], classLoaded: true, refreshClass: noop, setAccount: () => {}, signOut: noop, markSignedOut: () => {} }),
    [],
  );
  return (
    <SettingsProvider>
      <UserContext.Provider value={user}>
        <TeacherCardsContext.Provider value={NO_TEACHER_CARDS}>
          <GuestProgressProvider allowedModules={allowedModules}>
            <FlashcardDialogProvider teacherSignedIn={undefined} signIn={null} onSignedOut={() => {}}>
              {children}
            </FlashcardDialogProvider>
          </GuestProgressProvider>
        </TeacherCardsContext.Provider>
      </UserContext.Provider>
    </SettingsProvider>
  );
};
