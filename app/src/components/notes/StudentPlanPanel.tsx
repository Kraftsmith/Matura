import React, { useState } from 'react';
import { patchStudent, removeStudent } from '../../accountApi';
import { Button } from '../ui';
import { ExamFields } from '../ExamFields';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import type { ClassStudent, ExamPlan } from '../../users';

/** What the teacher plans with a learner. Name, email and password stay the learner's. Lazy chunk, teacher only. */
export const StudentPlanPanel: React.FC<{ student: ClassStudent; onRemoved: () => void }> = ({ student, onRemoved }) => {
  const { t } = useSettings();
  const { refreshClass } = useUser();
  const [plan, setPlan] = useState<ExamPlan>({ examDate: student.examDate, level: student.level, goal: student.goal });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  const save = () => {
    setSaved(false);
    setError(undefined);
    patchStudent(student.id, plan).then(refreshClass).then(() => setSaved(true), () => setError(t('auth.failed')));
  };

  const remove = () => {
    if (!window.confirm(t('teacher.removeConfirm', { name: student.name }))) return;
    removeStudent(student.id).then(refreshClass).then(onRemoved, () => setError(t('auth.failed')));
  };

  return (
    <section className="grid max-w-xl gap-4">
      <p className="text-sm leading-5 text-ink-2">{student.email}</p>
      <ExamFields plan={plan} onChange={setPlan} />
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={save}>
          {t('profile.save')}
        </Button>
        <Button size="sm" variant="ghost" onClick={remove}>
          {t('teacher.remove')}
        </Button>
        {saved && <span role="status" className="text-sm leading-5 text-success">{t('profile.saved')}</span>}
      </div>
      {error && <p className="text-sm leading-5 text-error">{error}</p>}
    </section>
  );
};
