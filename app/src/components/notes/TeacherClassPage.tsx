import React, { useEffect, useState } from 'react';
import { StickyNote } from 'lucide-react';
import type { MaturaModule } from '../../types';
import type { UserProfile } from '../../users';
import { TeacherDashboardView } from '../TeacherDashboardView';
import { ClassInvite } from '../ClassInvite';
import { useSettings } from '../../useSettings';
import { formatRelative } from '../../progressSummary';
import { fetchSummary, SignedOutError, type NotesSummary } from './notesApi';
import { useNotesStrings } from './notesStrings';

interface TeacherClassPageProps {
  modules: MaturaModule[];
  students: UserProfile[];
  onOpenStudent: (userId: string) => void;
  onSignedOut: () => void;
}

/** The class page with a notes line on each learner's card. Lazy chunk, teacher only. */
const TeacherClassPage: React.FC<TeacherClassPageProps> = ({ modules, students, onOpenStudent, onSignedOut }) => {
  const nt = useNotesStrings();
  const { t, uiLang } = useSettings();
  const [summary, setSummary] = useState<Record<string, NotesSummary>>();
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';

  useEffect(() => {
    let cancelled = false;
    fetchSummary()
      .then((s) => {
        if (!cancelled) setSummary(s);
      })
      .catch((e: unknown) => {
        if (e instanceof SignedOutError) onSignedOut();
      });
    return () => {
      cancelled = true;
    };
  }, [onSignedOut]);

  const notesLine = (studentId: string) => {
    if (!summary) return null;
    const s = summary[studentId];
    return (
      <div className="grid gap-1 border-t border-line-soft pt-3 text-sm leading-5 text-ink-2">
        <p className="flex items-center gap-1.5">
          <StickyNote className="h-4 w-4 shrink-0 text-primary" />
          {s ? nt('notes.card', { n: s.count, when: formatRelative(s.lastAt, t, locale) }) : nt('notes.cardNone')}
        </p>
        {s?.pinnedText && <p className="truncate text-ink">{s.pinnedText}</p>}
      </div>
    );
  };

  return <TeacherDashboardView modules={modules} students={students} onOpenStudent={onOpenStudent} beforeList={<ClassInvite />} renderStudentExtra={notesLine} />;
};

export default TeacherClassPage;
