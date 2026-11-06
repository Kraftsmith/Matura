import { waitUntil } from '@vercel/functions';
import { addHit, hitCount } from './rateLimit.js';

type Lang = 'pl' | 'en';

export type MailKind = 'verify' | 'exists' | 'reset' | 'setPassword' | 'newEmail' | 'emailChanging' | 'passwordChanged' | 'accountDeleted' | 'invite';

interface Template {
  subject: string;
  body: string;
  button?: string;
}

const NOT_YOU: Record<Lang, string> = {
  pl: 'Jeśli to nie Ty, zmień hasło i napisz do nas.',
  en: 'If this was not you, change your password and write to us.',
};

const TEMPLATES: Record<Lang, Record<MailKind, Template>> = {
  pl: {
    verify: { subject: 'Potwierdź swój e-mail', body: 'Kliknij przycisk, aby aktywować konto. Link działa 24 godziny.', button: 'Potwierdź e-mail' },
    exists: { subject: 'Masz już konto', body: 'Ktoś próbował założyć konto na ten adres, ale konto już istnieje. Możesz się zalogować albo zmienić hasło na stronie logowania.', button: 'Zaloguj się' },
    reset: { subject: 'Zmiana hasła', body: 'Kliknij przycisk, aby ustawić nowe hasło. Link działa 1 godzinę. Jeśli to nie Ty, zignoruj tę wiadomość.', button: 'Ustaw nowe hasło' },
    setPassword: { subject: 'Ustaw hasło', body: 'Twoje konto jest gotowe. Ustaw hasło, aby się zalogować. Link działa 72 godziny.', button: 'Ustaw hasło' },
    newEmail: { subject: 'Potwierdź nowy e-mail', body: 'Kliknij przycisk, aby potwierdzić nowy adres konta. Link działa 24 godziny.', button: 'Potwierdź e-mail' },
    emailChanging: { subject: 'Zmiana adresu e-mail', body: `Adres e-mail konta jest zmieniany. ${NOT_YOU.pl}` },
    passwordChanged: { subject: 'Hasło zostało zmienione', body: `Hasło do konta zostało zmienione. ${NOT_YOU.pl}` },
    accountDeleted: { subject: 'Konto usunięte', body: 'Twoje konto i wszystkie Twoje dane zostały usunięte.' },
    invite: { subject: 'Zaproszenie do klasy', body: 'Nauczyciel {teacher} zaprasza Cię do swojej klasy w Matura English. Po dołączeniu nauczyciel zobaczy Twoje imię, e-mail, postępy i odpowiedzi w zadaniach.', button: 'Dołącz do klasy' },
  },
  en: {
    verify: { subject: 'Confirm your email', body: 'Click the button to activate your account. The link works for 24 hours.', button: 'Confirm email' },
    exists: { subject: 'You already have an account', body: 'Someone tried to create an account with this address, but one already exists. You can sign in or change your password on the sign-in page.', button: 'Sign in' },
    reset: { subject: 'Change your password', body: 'Click the button to set a new password. The link works for 1 hour. If this was not you, ignore this message.', button: 'Set a new password' },
    setPassword: { subject: 'Set your password', body: 'Your account is ready. Set a password to sign in. The link works for 72 hours.', button: 'Set password' },
    newEmail: { subject: 'Confirm your new email', body: 'Click the button to confirm the new address of your account. The link works for 24 hours.', button: 'Confirm email' },
    emailChanging: { subject: 'Your email is being changed', body: `The email address of your account is being changed. ${NOT_YOU.en}` },
    passwordChanged: { subject: 'Your password was changed', body: `The password of your account was changed. ${NOT_YOU.en}` },
    accountDeleted: { subject: 'Account deleted', body: 'Your account and all your data have been deleted.' },
    invite: { subject: 'Invitation to a class', body: 'Teacher {teacher} invites you to their class in Matura English. After joining, the teacher will see your name, email, progress and answers to tasks.', button: 'Join the class' },
  },
};

const MAX_PER_HOUR = 3;

/** Links come only from this setting: a forged Host header must never decide where a token goes. */
export const appUrl = (): string => process.env.APP_URL ?? 'http://localhost:3000';

const isLocal = () => !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'development';

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

export const deliver = async (kind: MailKind, to: string, lang: string, path?: string, vars: Record<string, string> = {}): Promise<void> => {
  const raw = TEMPLATES[lang === 'en' ? 'en' : 'pl'][kind];
  // A name typed by a user goes into the mail: it must not become markup.
  const template = { ...raw, body: raw.body.replace(/\{(\w+)\}/g, (_, k: string) => escapeHtml(vars[k] ?? '')) };
  const link = path ? `${appUrl()}/#${path}` : undefined;
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (!isLocal()) throw Object.assign(new Error('mail'), { code: 'mail_not_configured' });
    console.log(`[mail] ${kind} to ${to}${link ? `: ${link}` : ''}`);
    return;
  }

  const html = `<p>${template.body}</p>${link ? `<p><a href="${link}">${template.button}</a></p>` : ''}`;
  const text = `${template.body}${link ? `\n\n${link}` : ''}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject: template.subject, html, text }),
  });
  if (!res.ok) throw Object.assign(new Error('mail'), { code: `mail_${res.status}` });
};

/**
 * Sends after the response, so its timing does not show whether there was anything to send.
 * Over the limit the mail is silently skipped: our forms must not be a way to flood someone's inbox.
 */
export const sendMail = (kind: MailKind, to: string, lang: string, path?: string, vars?: Record<string, string>): void => {
  const run = async () => {
    const limitKey = `mail:${to}`;
    if ((await hitCount(limitKey, 60)) >= MAX_PER_HOUR) return;
    await addHit(limitKey);
    await deliver(kind, to, lang, path, vars);
  };
  waitUntil(run().catch((e: { code?: string }) => console.error('mail_error', e.code ?? 'unknown')));
};
