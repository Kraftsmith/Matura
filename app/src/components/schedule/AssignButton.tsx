import React, { lazy, Suspense, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useFlashcardDialog } from '../../useAddFlashcard';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import { Button, type ButtonVariant } from '../ui';

// The dialog reaches only the teacher's browser.
const AssignDialog = lazy(() => import('./AssignDialog'));

/** Next to "Kopiuj link" for the teacher: set this page as homework. Renders nothing for a learner. */
export const AssignButton: React.FC<{ target: string; variant?: ButtonVariant }> = ({ target, variant = 'ghost' }) => {
  const { t } = useSettings();
  const { user } = useUser();
  const { lessonStudent } = useFlashcardDialog();
  const [open, setOpen] = useState(false);
  if (user.role !== 'teacher') return null;
  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)} title={t('hw.assignTitle')}>
        <ClipboardList className="h-4 w-4" />
        {t('hw.assign')}
      </Button>
      {open && (
        <Suspense fallback={null}>
          <AssignDialog target={target} initialStudent={lessonStudent} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
};
