import React from 'react';
import { TextField, fieldClass } from './ui';
import { useSettings } from '../useSettings';
import type { ExamLevel, ExamPlan } from '../users';

/** Filled in by the learner in their profile, and by the teacher on the learner's page. */
export const ExamFields: React.FC<{ plan: ExamPlan; onChange: (plan: ExamPlan) => void }> = ({ plan, onChange }) => {
  const { t } = useSettings();
  return (
    <div className="grid gap-4">
      <TextField label={t('profile.examDate')} type="date" value={plan.examDate ?? ''} onChange={(e) => onChange({ ...plan, examDate: e.target.value || undefined })} />
      <label className="grid gap-1.5">
        <span className="text-base font-semibold text-ink">{t('profile.level')}</span>
        <select className={fieldClass} value={plan.level ?? ''} onChange={(e) => onChange({ ...plan, level: (e.target.value || undefined) as ExamLevel | undefined })}>
          <option value="">{t('profile.levelNone')}</option>
          <option value="podstawowa">{t('profile.levelBasic')}</option>
          <option value="rozszerzona">{t('profile.levelExtended')}</option>
        </select>
      </label>
      <TextField label={t('profile.goal')} maxLength={120} value={plan.goal ?? ''} onChange={(e) => onChange({ ...plan, goal: e.target.value || undefined })} />
    </div>
  );
};
