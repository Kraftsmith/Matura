import { useState, type FormEvent } from 'react';

type Role = 'student' | 'parent' | 'teacher';

interface Props {
  /** Where on the site the form stands, e.g. "landing/parents". */
  source: string;
  defaultRole?: Role;
  title?: string;
  /** Shown above the field; the consent line is fixed. */
  text?: string;
  compact?: boolean;
}

const ROLES: { id: Role; label: string }[] = [
  { id: 'student', label: 'Uczeń' },
  { id: 'parent', label: 'Rodzic' },
  { id: 'teacher', label: 'Nauczyciel' },
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

/** UTM parameters of the visit, kept for the whole session so a form on another page still knows them. */
const utmOfVisit = (): Record<string, string> | undefined => {
  try {
    const fromUrl = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = fromUrl.get(k);
      if (v) found[k] = v.slice(0, 80);
    }
    if (Object.keys(found).length > 0) {
      window.sessionStorage.setItem('site.utm', JSON.stringify(found));
      return found;
    }
    const stored = window.sessionStorage.getItem('site.utm');
    return stored ? (JSON.parse(stored) as Record<string, string>) : undefined;
  } catch {
    return undefined;
  }
};

/** Waiting-list form (Spec - Landing §10.1). Posts to the app's API on the same host; always shows one answer. */
export default function LeadForm({ source, defaultRole = 'student', title, text, compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(defaultRole);
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/account?action=lead-subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, role, source, lang: 'pl', utm: utmOfVisit(), website }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-2xl bg-success-tint p-5 text-success" role="status">
        <p className="font-bold">Sprawdź skrzynkę i potwierdź adres.</p>
        <p className="mt-1 text-sm">Jeśli wiadomości nie ma, zajrzyj do spamu.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? '' : 'card p-5'} data-lead-source={source}>
      {title && <p className="text-lg font-bold text-ink">{title}</p>}
      {text && <p className="mt-1 text-sm text-ink-2">{text}</p>}
      <div className={`mt-3 flex flex-col gap-3 ${compact ? 'sm:flex-row sm:items-end' : ''}`}>
        <label className="flex-1 text-sm font-semibold text-ink">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base font-normal text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="twoj@adres.pl"
            autoComplete="email"
          />
        </label>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Kim jesteś">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              onClick={() => setRole(r.id)}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${role === r.id ? 'bg-primary text-white' : 'bg-chip text-ink-2 hover:bg-line'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {/* Bots fill every field; people never see this one. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Strona www
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <label className="mt-3 flex items-start gap-2 text-sm text-ink-2">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
        <span>
          Chcę otrzymywać informacje o starcie i nowościach. Mogę zrezygnować w każdej chwili.{' '}
          <a href="/polityka-prywatnosci" className="text-primary underline underline-offset-2">
            Polityka prywatności
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={!consent || state === 'sending'}
        className="mt-3 rounded-lg bg-primary px-5 py-2.5 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        data-event="lead_submit"
      >
        {state === 'sending' ? 'Wysyłanie…' : 'Zapisz mnie'}
      </button>
      {state === 'error' && <p className="mt-2 text-sm text-error">Nie udało się wysłać. Spróbuj za chwilę.</p>}
    </form>
  );
}
