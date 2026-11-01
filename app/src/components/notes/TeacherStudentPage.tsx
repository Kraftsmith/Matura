import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, StickyNote } from 'lucide-react';
import type { MaturaModule, SectionType } from '../../types';
import type { UserProfile } from '../../users';
import { DashboardView } from '../DashboardView';
import { Button, Tabs } from '../ui';
import { TeacherNotesPanel } from './TeacherNotesPanel';
import { useNotesStrings } from './notesStrings';
import { useStudentNotes } from './useStudentNotes';

const HIDDEN_KEY = 'matura.notesHidden';

const readHidden = (): boolean => {
  try {
    return window.localStorage.getItem(HIDDEN_KEY) === '1';
  } catch {
    return false;
  }
};

const writeHidden = (hidden: boolean) => {
  try {
    window.localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0');
  } catch {
    /* storage unavailable: the choice lasts until reload */
  }
};

type Tab = 'progress' | 'notes';

interface TeacherStudentPageProps {
  modules: MaturaModule[];
  student: UserProfile;
  headerAction: React.ReactNode;
  onOpen: (moduleId: string, section: SectionType) => void;
  onBackToClass: () => void;
  onSignedOut: () => void;
}

/** A learner's page as the teacher sees it. Exists only in the lazy chunk, loaded after the server confirmed the teacher. */
const TeacherStudentPage: React.FC<TeacherStudentPageProps> = ({ modules, student, headerAction, onOpen, onBackToClass, onSignedOut }) => {
  const nt = useNotesStrings();
  const notesState = useStudentNotes(student.id, onSignedOut);
  const [tab, setTab] = useState<Tab>('progress');
  const [hidden, setHidden] = useState(readHidden);
  const [moduleFilter, setModuleFilter] = useState('');
  const { deleted, deleteFailed, notes, undoDelete } = notesState;

  const perModule = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of notes) if (n.moduleId) counts[n.moduleId] = (counts[n.moduleId] ?? 0) + 1;
    return counts;
  }, [notes]);

  const toggleHidden = () => {
    writeHidden(!hidden);
    setHidden(!hidden);
    setTab('progress');
  };

  const openTopic = (moduleId: string) => {
    setModuleFilter(moduleId);
    setTab('notes');
  };

  const topicBadge = (moduleId: string) => {
    const n = perModule[moduleId];
    if (!n) return null;
    const label = nt('notes.topicBadge', { n });
    return (
      <button type="button" aria-label={label} title={label} onClick={() => openTopic(moduleId)} className="ml-2 inline-flex cursor-pointer items-center gap-1 align-middle text-sm leading-5 text-primary hover:underline">
        <StickyNote className="h-4 w-4" />
        {n}
      </button>
    );
  };

  const hideButton = (
    <Button variant="ghost" size="sm" onClick={toggleHidden}>
      {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {hidden ? nt('notes.show') : nt('notes.hide')}
    </Button>
  );

  return (
    <>
      <DashboardView
        modules={modules}
        user={student}
        teacherView
        onOpen={onOpen}
        onBackToClass={onBackToClass}
        headerAction={
          <>
            {hideButton}
            {headerAction}
          </>
        }
        resetConfirmSuffix={nt('notes.resetKeeps')}
        renderTopicBadge={hidden ? undefined : topicBadge}
        tabs={
          hidden ? undefined : (
            <Tabs<Tab>
              ariaLabel={nt('notes.tabsLabel')}
              value={tab}
              onChange={setTab}
              items={[
                { id: 'progress', label: nt('notes.tabProgress') },
                { id: 'notes', label: nt('notes.tabNotes'), count: notes.length },
              ]}
            />
          )
        }
        replacement={
          !hidden && tab === 'notes' ? (
            <TeacherNotesPanel studentId={student.id} studentName={student.name} modules={modules} notesState={notesState} moduleFilter={moduleFilter} onModuleFilter={setModuleFilter} />
          ) : undefined
        }
      />

      {(deleted || deleteFailed) && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-ink px-4 py-3 text-sm leading-5 text-white shadow-lg">
          {deleted ? nt('notes.deleted') : nt('notes.deleteFailed')}
          {deleted && (
            <button type="button" onClick={undoDelete} className="cursor-pointer font-semibold underline">
              {nt('notes.undo')}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default TeacherStudentPage;
