/**
 * What is free and what full access costs (Spec - Subskrypcje i cennik §3–5). One place for the site
 * (/cennik, the landing, the access wall) and the app (#dostep/kup): a price is never typed into a page.
 * All prices are gross, in złoty, VAT included. Owner's decisions of 10–11.11.2026.
 */

/** Topics a free account opens in full; the other topics show their beginning and a lock (§6.4). */
export const freeAccountModules: readonly string[] = ['czlowiek'];
export const isFreeAccountModule = (id: string): boolean => freeAccountModules.includes(id);

export type PlanId = 'student' | 'parent' | 'teacher';
export type Period = 'month' | 'season';

export interface Plan {
  id: PlanId;
  /** Name of the plan as the pages show it. */
  name: string;
  /** Who the plan is for, one line under the name. */
  tagline: string;
  /** Price of a month, with automatic renewal. */
  monthly: number;
  /**
   * Price of the one-time "Dostęp do matury" until 30 June; null means the plan has no such package yet.
   * The student and parent prices are the spec's defaults (§15, question 3) until the owner confirms them.
   */
  season: number | null;
  /** What the plan includes, in the order the card lists it. */
  includes: readonly string[];
  /** Price of one more seat per month, when the plan can buy one. */
  extraSeat: { price: number; label: string } | null;
  /** Whose full access the plan pays for. */
  seats: string;
}

export const CURRENCY = 'zł';

/** The one-time package ends on this day of the school year the matura is in. */
export const SEASON_END = { month: 6, day: 30, label: '30 czerwca' } as const;

export const plans: readonly Plan[] = [
  {
    id: 'student',
    name: 'Uczeń',
    tagline: 'Dla ucznia, który płaci sam',
    monthly: 20,
    season: 99,
    includes: ['Wszystkie 14 tematów w całości', 'Każdy tekst, ćwiczenie, test i talia fiszek', 'Postęp na koncie, na każdym urządzeniu'],
    extraSeat: null,
    seats: 'Pełny dostęp dla Ciebie',
  },
  {
    id: 'parent',
    name: 'Rodzic',
    tagline: 'Dla rodzica, który chce widzieć postępy',
    monthly: 30,
    season: 149,
    includes: ['Pełny dostęp dla jednego dziecka', 'Panel rodzica: tematy, wyniki, ostatnia aktywność, zadania domowe', 'E-mail z podsumowaniem raz w tygodniu'],
    extraSeat: { price: 20, label: 'Drugie dziecko' },
    seats: 'Miejsce dla jednego dziecka w cenie',
  },
  {
    id: 'teacher',
    name: 'Nauczyciel',
    tagline: 'Dla nauczyciela i korepetytora',
    monthly: 30,
    season: null,
    includes: ['Pełny dostęp dla Ciebie i miejsce dla jednego ucznia', 'Klasa, kalendarz, zadania domowe i notatki: zawsze za darmo', 'Uczeń może też płacić sam albo dostać miejsce od rodzica'],
    extraSeat: { price: 15, label: 'Każdy kolejny uczeń' },
    seats: 'Miejsce dla jednego ucznia w cenie',
  },
];

export const planById = (id: string): Plan | undefined => plans.find((p) => p.id === id);

/** Price of a plan for a period; null when the plan has no such period. */
export const priceOf = (plan: Plan, period: Period): number | null => (period === 'month' ? plan.monthly : plan.season);

export const formatPrice = (n: number): string => `${n} ${CURRENCY}`;

/** How each period is paid (§6.2): BLIK and Przelewy24 cannot renew, so they pay only for the one-time package. */
export const PAYMENT_METHODS = 'Miesięcznie: karta. Do matury: BLIK, Przelewy24 albo karta.';

/**
 * Whether the buy buttons lead to the checkout. False until api/billing.ts and #dostep/kup exist
 * (Spec - Subskrypcje, tasks 2.1–2.2): until then the pages show the prices and offer the waiting list.
 */
export const checkoutOpen = false;

/** App address of the plan chooser (§6.1), relative to the app's hash. */
export const buyRoute = (plan: PlanId, period: Period): string => `dostep/kup?plan=${plan}&period=${period}`;
