import React, { useEffect, useState } from 'react';
import { fetchClassCode, replaceClassCode } from '../../accountApi';
import { Button } from '../ui';
import { useSettings } from '../../useSettings';
import { shareLink } from '../../userRoute';

/** The link that brings learners into the class. Lazy chunk, teacher only. */
export const ClassInvite: React.FC = () => {
  const { t } = useSettings();
  const [code, setCode] = useState<string>();
  const [copied, setCopied] = useState(false);

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
    </section>
  );
};
