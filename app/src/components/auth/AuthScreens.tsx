import React, { useEffect, useRef, useState } from 'react';
import { ApiError, fetchInvite, forgotPassword, joinClass, login, register, resendVerification, resetPassword, verifyEmail } from '../../accountApi';
import { Button, Callout, TextField } from '../ui';
import { useSettings } from '../../useSettings';
import type { AccountUser } from '../../users';
import { RETURN_KEY } from './returnTo';
import { usePasswordError } from './usePasswordError';

const RESEND_SECONDS = 60;

type SignedIn = (user: AccountUser) => void;

const linkClass = 'text-sm leading-5 font-semibold text-primary hover:underline';

export const AuthShell: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="flex min-h-screen flex-col items-center bg-surface px-4 py-10 font-sans text-ink antialiased">
    <span className="text-[22px] leading-none font-bold tracking-tight text-primary">
      matura<span className="text-ink">english</span>
    </span>
    <main className="mt-8 grid w-full max-w-[400px] gap-5">
      <h1 className="text-2xl leading-8 font-semibold">{title}</h1>
      {children}
    </main>
  </div>
);

/** The show button replaces a second "repeat password" field. */
export const PasswordField: React.FC<React.ComponentProps<typeof TextField>> = (props) => {
  const { t } = useSettings();
  const [shown, setShown] = useState(false);
  return (
    <TextField
      {...props}
      type={shown ? 'text' : 'password'}
      trailing={
        <button type="button" onClick={() => setShown((s) => !s)} className="cursor-pointer font-semibold text-primary hover:underline">
          {shown ? t('auth.hide') : t('auth.show')}
        </button>
      }
    />
  );
};

/** The sentence with the two links, used at sign-up and for accounts made by a script. */
export const TermsLabel: React.FC<{ checked: boolean; required?: boolean; onChange: (checked: boolean) => void }> = ({ checked, required, onChange }) => {
  const { t } = useSettings();
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm leading-5">
      <input type="checkbox" required={required} className="mt-0.5 h-4 w-4 accent-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {t('auth.termsBefore')}{' '}
        <a href="#regulamin" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
          {t('auth.terms')}
        </a>{' '}
        {t('auth.and')}{' '}
        <a href="#prywatnosc" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
          {t('auth.privacy')}
        </a>
      </span>
    </label>
  );
};

/** The button waits a minute between mails. */
const ResendButton: React.FC<{ email: string }> = ({ email }) => {
  const { t } = useSettings();
  const [left, setLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  const send = () => {
    setLeft(RESEND_SECONDS);
    resendVerification(email).catch(() => undefined);
  };

  return (
    <Button variant="secondary" disabled={left > 0} onClick={send}>
      {left > 0 ? t('auth.resendIn', { n: left }) : t('auth.resend')}
    </Button>
  );
};

export const LoginScreen: React.FC<{ expired: boolean; onSignedIn: SignedIn }> = ({ expired, onSignedIn }) => {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [unverified, setUnverified] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(undefined);
    setUnverified(false);
    try {
      onSignedIn(await login(email, password));
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      if (status === 403) setUnverified(true);
      else setError(t(status === 401 || status === 400 ? 'auth.wrong' : status === 429 ? 'auth.tooMany' : 'auth.failed'));
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('auth.signIn')}>
      {expired && <Callout tone="warning">{t('auth.expired')}</Callout>}
      {unverified && (
        <Callout tone="warning">
          <div className="grid gap-3">
            {t('auth.notVerified')}
            <ResendButton email={email} />
          </div>
        </Callout>
      )}
      <form onSubmit={(e) => void submit(e)} className="grid gap-4">
        <TextField label={t('auth.email')} type="email" autoComplete="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label={t('auth.password')} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <Button type="submit" disabled={busy}>
          {t('auth.signIn')}
        </Button>
      </form>
      <a href="#forgot" className={linkClass}>
        {t('auth.forgotLink')}
      </a>
      <p className="text-sm leading-5 text-ink-2">
        {t('auth.noAccount')}{' '}
        <a href="#register" className="font-semibold text-primary hover:underline">
          {t('auth.signUp')}
        </a>
      </p>
    </AuthShell>
  );
};

export const RegisterScreen: React.FC<{ inviteCode?: string }> = ({ inviteCode }) => {
  const { t, uiLang } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string>();
  const [teacher, setTeacher] = useState<string>();
  const passwordError = usePasswordError();

  useEffect(() => {
    if (!inviteCode) return;
    fetchInvite(inviteCode).then((found) => setTeacher(found.name)).catch(() => undefined);
  }, [inviteCode]);

  if (sentTo) {
    return (
      <AuthShell title={t('auth.inboxTitle')}>
        <p className="text-base leading-6">{t('auth.inboxBody', { email: sentTo })}</p>
        <p className="text-sm leading-5 text-ink-2">{t('auth.inboxSpam')}</p>
        <ResendButton email={sentTo} />
        <a href="#login" className={linkClass}>
          {t('auth.backToLogin')}
        </a>
      </AuthShell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(undefined);
    try {
      await register({ name, email, password, acceptedTerms: accepted, uiLang, inviteCode: teacher ? inviteCode : undefined, website });
      setSentTo(email);
    } catch (err) {
      setError(passwordError(err));
      setBusy(false);
    }
  };

  /** Someone who already has an account comes back to this invitation after signing in. */
  const keepInvite = () => {
    try {
      if (inviteCode) window.sessionStorage.setItem(RETURN_KEY, `join/${inviteCode}`);
    } catch {
      /* storage unavailable: the link can be opened again */
    }
  };

  return (
    <AuthShell title={t('auth.signUp')}>
      {teacher && <Callout title={t('auth.joining', { teacher })}>{t('auth.joinWarn')}</Callout>}
      <form onSubmit={(e) => void submit(e)} className="grid gap-4">
        <TextField label={t('auth.name')} autoComplete="name" autoFocus required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label={t('auth.email')} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label={t('auth.password')} autoComplete="new-password" required hint={t('auth.passwordHint')} value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <TermsLabel checked={accepted} required onChange={setAccepted} />
        <Button type="submit" disabled={busy}>
          {t('auth.signUp')}
        </Button>
      </form>
      <p className="text-sm leading-5 text-ink-2">
        {t('auth.haveAccount')}{' '}
        <a href="#login" onClick={keepInvite} className="font-semibold text-primary hover:underline">
          {t('auth.signIn')}
        </a>
      </p>
    </AuthShell>
  );
};

export const ForgotScreen: React.FC = () => {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(undefined);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError(t('auth.failed'));
    }
    setBusy(false);
  };

  return (
    <AuthShell title={t('auth.forgotTitle')}>
      {sent ? (
        <Callout tone="success">{t('auth.forgotSent')}</Callout>
      ) : (
        <form onSubmit={(e) => void submit(e)} className="grid gap-4">
          <TextField label={t('auth.email')} type="email" autoComplete="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" disabled={busy}>
            {t('auth.forgotSubmit')}
          </Button>
        </form>
      )}
      <a href="#login" className={linkClass}>
        {t('auth.backToLogin')}
      </a>
    </AuthShell>
  );
};

/** Spent by the page, not by opening the link: mail scanners open every link they see. */
export const VerifyScreen: React.FC<{ token: string; onSignedIn: SignedIn }> = ({ token, onSignedIn }) => {
  const { t } = useSettings();
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    verifyEmail(token).then(onSignedIn, () => setFailed(true));
  }, [token, onSignedIn]);

  if (!failed) return <AuthShell title={t('auth.verifying')} />;
  return (
    <AuthShell title={t('auth.linkGone')}>
      <a href="#login" className={linkClass}>
        {t('auth.backToLogin')}
      </a>
    </AuthShell>
  );
};

export const ResetScreen: React.FC<{ token: string; onSignedIn: SignedIn }> = ({ token, onSignedIn }) => {
  const { t } = useSettings();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [gone, setGone] = useState(false);
  const passwordError = usePasswordError();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(undefined);
    try {
      onSignedIn(await resetPassword(token, password));
    } catch (err) {
      if (err instanceof ApiError && err.status === 410) setGone(true);
      else setError(passwordError(err));
      setBusy(false);
    }
  };

  if (gone) {
    return (
      <AuthShell title={t('auth.linkGone')}>
        <a href="#forgot" className={linkClass}>
          {t('auth.forgotLink')}
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('auth.resetTitle')}>
      <form onSubmit={(e) => void submit(e)} className="grid gap-4">
        <PasswordField label={t('auth.newPassword')} autoComplete="new-password" autoFocus required hint={t('auth.passwordHint')} value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <Button type="submit" disabled={busy}>
          {t('auth.resetSubmit')}
        </Button>
      </form>
    </AuthShell>
  );
};

export const JoinScreen: React.FC<{ code: string; user: AccountUser; onAccount: (user: AccountUser) => void }> = ({ code, user, onAccount }) => {
  const { t } = useSettings();
  const [teacher, setTeacher] = useState<string>();
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchInvite(code).then((found) => setTeacher(found.name)).catch(() => setBad(true));
  }, [code]);

  const later = (
    <a href="#dashboard" className={linkClass}>
      {t('auth.joinLater')}
    </a>
  );

  if (user.role === 'teacher') return <AuthShell title={t('auth.joinTeacher')}>{later}</AuthShell>;
  if (bad) return <AuthShell title={t('auth.joinBad')}>{later}</AuthShell>;
  if (!teacher) return <AuthShell title={t('auth.loading')} />;

  const accept = async () => {
    setBusy(true);
    try {
      onAccount(await joinClass(code));
      window.location.hash = 'dashboard';
    } catch {
      setBad(true);
    }
  };

  return (
    <AuthShell title={t('auth.joinTitle')}>
      <p className="text-base leading-6">{t('auth.joinBody', { teacher })}</p>
      <Callout>{t('auth.joinWarn')}</Callout>
      <Button disabled={busy} onClick={() => void accept()}>
        {t('auth.joinAccept')}
      </Button>
      {later}
    </AuthShell>
  );
};

/** The owner's texts go here; until then the page says so rather than inventing legal wording. */
export const LegalScreen: React.FC<{ page: 'regulamin' | 'prywatnosc' }> = ({ page }) => {
  const { t } = useSettings();
  return (
    <AuthShell title={t(page === 'regulamin' ? 'auth.termsTitle' : 'auth.privacyTitle')}>
      <p className="text-base leading-6">{t('auth.legalPending')}</p>
    </AuthShell>
  );
};
