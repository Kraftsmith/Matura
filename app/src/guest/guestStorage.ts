import type { ProgressState } from '../progress-context';
import { isProgressState } from '../progressOps';

/**
 * Where a guest's work on the public site lives (Spec - Landing §8.3). The site and the app share the
 * origin, so the app reads the same key after the guest signs up and offers to move the work.
 */
export const GUEST_KEY = 'matura.guest.v1';

const storage = (): Storage | undefined => (typeof window === 'undefined' ? undefined : window.localStorage);

export const readGuestProgress = (): ProgressState | undefined => {
  try {
    const parsed: unknown = JSON.parse(storage()?.getItem(GUEST_KEY) ?? 'null');
    return isProgressState(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const writeGuestProgress = (state: ProgressState): void => {
  try {
    storage()?.setItem(GUEST_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the work lasts until the page is closed */
  }
};

export const removeGuestProgress = (): void => {
  try {
    storage()?.removeItem(GUEST_KEY);
  } catch {
    /* nothing to remove */
  }
};
