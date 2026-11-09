import { useState, type FormEvent } from 'react';

/** Contact form (Spec - Landing §7.7): posts to the app's API, no double opt-in. */
export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/account?action=contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, message, website }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-2xl bg-success-tint p-5 text-success" role="status">
        <p className="font-bold">Dziękujemy. Odpowiemy na podany adres.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5">
      <label className="block text-sm font-semibold text-ink">
        E-mail
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </label>
      <label className="mt-3 block text-sm font-semibold text-ink">
        Wiadomość
        <textarea required maxLength={2000} rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        <span className="mt-1 block text-right text-xs font-normal text-ink-3">{message.length}/2000</span>
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Strona www
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <p className="mt-2 text-xs text-ink-3">Wiadomość i adres przechowujemy 12 miesięcy, żeby móc odpowiedzieć. Szczegóły w polityce prywatności.</p>
      <button type="submit" disabled={state === 'sending'} className="mt-3 rounded-lg bg-primary px-5 py-2.5 font-bold text-white hover:bg-primary-hover disabled:opacity-50">
        {state === 'sending' ? 'Wysyłanie…' : 'Wyślij'}
      </button>
      {state === 'error' && <p className="mt-2 text-sm text-error">Nie udało się wysłać. Spróbuj za chwilę albo napisz e-mail.</p>}
    </form>
  );
}
