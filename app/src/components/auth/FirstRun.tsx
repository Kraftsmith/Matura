import React, { useState } from 'react';
import { patchMe } from '../../accountApi';
import { Button } from '../ui';
import { useSettings } from '../../useSettings';
import type { AccountUser, ExamPlan } from '../../users';
import { ExamFields } from '../ExamFields';
import { AuthShell, TermsLabel } from './AuthScreens';

type OnAccount = (user: AccountUser) => void;

/** For accounts created by a script: they never saw the checkbox in the sign-up form. */
export const TermsStep: React.FC<{ onAccount: OnAccount }> = ({ onAccount }) => {
  const { t } = useSettings();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string>();

  const accept = () => {
    patchMe({ acceptTerms: true }).then(onAccount, () => setError(t('auth.failed')));
  };

  return (
    <AuthShell title={t('auth.termsStep')}>
      <TermsLabel checked={accepted} onChange={setAccepted} />
      {error && <p className="text-sm leading-5 text-error">{error}</p>}
      <Button disabled={!accepted} onClick={accept}>
        {t('auth.termsAccept')}
      </Button>
    </AuthShell>
  );
};

export const OnboardingStep: React.FC<{ onAccount: OnAccount }> = ({ onAccount }) => {
  const { t } = useSettings();
  const [plan, setPlan] = useState<ExamPlan>({});
  const [busy, setBusy] = useState(false);

  const finish = (patch: Record<string, unknown>) => {
    setBusy(true);
    patchMe({ ...patch, onboarded: true }).then(onAccount, () => setBusy(false));
  };

  return (
    <AuthShell title={t('onboard.title')}>
      <ExamFields plan={plan} onChange={setPlan} />
      <Button disabled={busy} onClick={() => finish({ examDate: plan.examDate ?? null, level: plan.level ?? null, goal: plan.goal ?? null })}>
        {t('profile.save')}
      </Button>
      <Button variant="ghost" disabled={busy} onClick={() => finish({})}>
        {t('onboard.skip')}
      </Button>
    </AuthShell>
  );
};
