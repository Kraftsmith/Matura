import React, { useEffect, useState } from 'react';
import { fetchClassCode, inviteByEmail, replaceClassCode } from '../accountApi';
import { Button, TextField } from './ui';
import { useSettings } from '../useSettings';
import { shareLink } from '../userRoute';

/** The link that brings learners into the class, and a way to mail it to one of them. Rendered for the teacher only. */
export const ClassInvite: React.FC = () => {
  const { t } = useSettings();
  const [code, setCode] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState<string>();
  const [sendError, setSendError] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchClassCode().then(setCode).catch(() => undefined);
  }, []);

  if (!code) return null;
  const url = shareLink(`join/${code}`);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => undefined);
  };

  const replace = () => {
    if (!window.confirm(t('teacher.inviteNewConfirm'))) return;
    setCopied(false);
    replaceClassCode().then(setCode).catch(() => undefined);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setSent(undefined);
    setSendError(undefined);
    inviteByEmail(email).then(
      () => {
        setSent(email);
        setEmail('');
        setBusy(false);
      },
      () => {
        setSendError(t('auth.failed'));
        setBusy(false);
      },
    );
  };

  return (
    <section className="grid gap-3 rounded-2xl border border-line bg-surface p-5">
      <div>
        <h2 className="text-xl leading-7 font-semibold">{t('teacher.inviteTitle')}</h2>
        <p className="text-sm leading-5 text-ink-2">{t('teacher.inviteDesc')}</p>
      </div>
      <p className="rounded bg-hero px-3 py-2 text-sm leading-5 break-all">{url}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={copy}>
          {copied ? t('teacher.inviteCopied') : t('teacher.inviteCopy')}
        </Button>
        <Button size="sm" variant="ghost" onClick={replace}>
          {t('teacher.inviteNew')}
        </Button>
      </div>
      <form onSubmit={send} className="flex flex-wrap items-end gap-2 border-t border-line-soft pt-3">
        <TextField className="min-w-48 flex-1" label={t('teacher.inviteEmail')} type="email" autoComplete="off" required value={email} onChange={(e) => setEmail(e.target.value)} error={sendError} />
        <Button type="submit" size="sm" variant="secondary" disabled={busy}>
          {t('teacher.inviteSend')}
        </Button>
        {sent && (
          <p role="status" className="basis-full text-sm leading-5 text-success">
            {t('teacher.inviteSent', { email: sent })}
          </p>
        )}
      </form>
    </section>
  );
};
