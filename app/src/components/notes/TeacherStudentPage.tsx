import React, { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, MessageSquare, StickyNote } from 'lucide-react';
import type { MaturaModule, SectionType } from '../../types';
import type { ClassStudent } from '../../users';
import { DashboardView } from '../DashboardView';
import { Button, Tabs, Toast } from '../ui';
import { TeacherCardsPanel } from '../TeacherCardsPanel';
import { StudentScheduleTabs } from '../schedule/StudentScheduleTabs';
import { MessageDialog } from '../messages/MessageDialog';
import { MessagesBlock } from '../messages/MessagesBlock';
import { StudentPlanPanel } from './StudentPlanPanel';
import { useSettings } from '../../useSettings';
import { useUser } from '../../useUser';
import { useTeacherCards } from '../../useTeacherCards';
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

type Tab = 'progress' | 'notes' | 'cards' | 'lessons' | 'homework' | 'plan';

interface TeacherStudentPageProps {
  modules: MaturaModule[];
  student: ClassStudent;
  /** Which tab to open first; the lesson bar links straight to the cards, a "homework done" notification to the homework. */
  initialTab?: 'cards' | 'homework';
  onOpen: (moduleId: string, section: SectionType) => void;
  onOpenDeck: (moduleId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onBackToClass: () => void;
  onSignedOut: () => void;
}

/** A learner's page as the teacher sees it. Exists only in the lazy chunk, loaded after the server confirmed the teacher. */
const TeacherStudentPage: React.FC<TeacherStudentPageProps> = ({ modules, student, initialTab, onOpen, onOpenDeck, onOpenLesson, onBackToClass, onSignedOut }) => {
  const nt = useNotesStrings();
  const { t } = useSettings();
  const { cardsOf } = useTeacherCards();
  const { refreshClass } = useUser();
  const notesState = useStudentNotes(student.id, onSignedOut);

  // The learner may have saved since the class was loaded: opening their page fetches it again.
  useEffect(() => {
    void refreshClass();
  }, [student.id, refreshClass]);
  const [tab, setTab] = useState<Tab>(initialTab ?? 'progress');
  const [hidden, setHidden] = useState(readHidden);
  const [moduleFilter, setModuleFilter] = useState('');
  const [writing, setWriting] = useState(false);
  const { deleted, deleteFailed, notes, undoDelete } = notesState;
  const cardCount = Object.values(cardsOf(student.id)).reduce((n, cards) => n + cards.length, 0);

  const perModule = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of notes) if (n.moduleId) counts[n.moduleId] = (counts[n.moduleId] ?? 0) + 1;
    return counts;
  }, [notes]);

  const toggleHidden = () => {
    writeHidden(!hidden);
    setHidden(!hidden);
    if (tab === 'notes') setTab('progress');
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
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => setWriting(true)}>
        <MessageSquare className="h-4 w-4" />
        {t('msg.write')}
      </Button>
      <Button variant="ghost" size="sm" onClick={toggleHidden}>
        {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {hidden ? nt('notes.show') : nt('notes.hide')}
      </Button>
    </div>
  );

  return (
    <>
      <DashboardView
        modules={modules}
        user={student}
        teacherView
        onOpen={onOpen}
        onOpenDeck={onOpenDeck}
        onBackToClass={onBackToClass}
        headerAction={hideButton}
        resetConfirmSuffix={nt('notes.resetKeeps')}
        renderTopicBadge={hidden ? undefined : topicBadge}
        tabs={
          <Tabs<Tab>
            ariaLabel={nt('notes.tabsLabel')}
            value={tab}
            onChange={setTab}
            items={[
              { id: 'progress', label: nt('notes.tabProgress') },
              ...(hidden ? [] : [{ id: 'notes' as const, label: nt('notes.tabNotes'), count: notes.length }]),
              { id: 'cards', label: t('lesson.tab'), count: cardCount },
              { id: 'lessons', label: t('teacher.tabLessons') },
              { id: 'homework', label: t('teacher.tabHomework') },
              { id: 'plan', label: t('profile.matura') },
            ]}
          />
        }
        replacement={
          tab === 'cards' ? (
            <TeacherCardsPanel student={student} modules={modules} />
          ) : tab === 'lessons' ? (
            <StudentScheduleTabs student={student} tab={tab} onOpenLesson={onOpenLesson} onSignedOut={onSignedOut} />
          ) : tab === 'homework' ? (
            <div className="grid gap-8">
              <StudentScheduleTabs student={student} tab={tab} onOpenLesson={onOpenLesson} onSignedOut={onSignedOut} />
              <MessagesBlock student={student} onSignedOut={onSignedOut} />
            </div>
          ) : tab === 'plan' ? (
            <StudentPlanPanel student={student} onRemoved={onBackToClass} />
          ) : !hidden && tab === 'notes' ? (
            <TeacherNotesPanel studentId={student.id} studentName={student.name} modules={modules} notesState={notesState} moduleFilter={moduleFilter} onModuleFilter={setModuleFilter} />
          ) : undefined
        }
      />

      {writing && <MessageDialog students={[student]} onClose={() => setWriting(false)} />}

      {(deleted || deleteFailed) && (
        <Toast action={deleted ? { label: nt('notes.undo'), onClick: undoDelete } : undefined}>{deleted ? nt('notes.deleted') : nt('notes.deleteFailed')}</Toast>
      )}
    </>
  );
};

export default TeacherStudentPage;
