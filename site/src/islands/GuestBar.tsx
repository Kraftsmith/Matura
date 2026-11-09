import { useEffect, useState } from 'react';

export interface GuestBarProps {
  /** Registration in the app, with src and next (Spec - Landing §8.4). */
  registerHref: string;
  loginHref: string;
  /** The same page inside the app, for someone who already has an account. */
  appHref: string;
}

type Who = 'guest' | 'account';

/**
 * The bar above an open topic (Spec - Landing §8.2). Nothing is rendered until the browser knows whether a
 * session exists: the HTML built at deploy time is the same for everyone.
 */
export default function GuestBar({ registerHref, loginHref, appHref }: GuestBarProps) {
  const [who, setWho] = useState<Who>();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/me', { credentials: 'include' })
      .then((r) => {
        if (!cancelled) setWho(r.ok ? 'account' : 'guest');
      })
      .catch(() => {
        if (!cancelled) setWho('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!who) return null;

  if (who === 'account') {
    return (
      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary-tint bg-primary-tint px-4 py-3 text-sm text-primary-hover">
        <span>Masz konto. Otwórz ten temat w aplikacji, tam postęp zapisze się na koncie.</span>
        <a href={appHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          Otwórz w aplikacji →
        </a>
      </div>
    );
  }

  return (
    <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-hero px-4 py-3 text-sm text-ink-2">
      <span>Przeglądasz bez konta. Postęp zapisuje się tylko w tej przeglądarce.</span>
      <span className="flex flex-wrap items-center gap-3">
        <a href={registerHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          Załóż konto, a go przeniesiemy
        </a>
        <a href={loginHref} className="text-ink-2 underline-offset-2 hover:underline">
          Zaloguj się
        </a>
      </span>
    </div>
  );
}
