import React from 'react';
import { ChevronRight, Users } from 'lucide-react';
import type { MaturaModule } from '../types';
import type { UserProfile } from '../users';
import { Button, Meter, SectionTitle } from './ui';
import { Avatar, GrammarStatusChip } from './GrammarStatusChip';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { GRAMMAR_PASS_SCORE } from '../progress-context';
import { formatRelative, summarizeUser, type UserSummary } from '../progressSummary';

interface TeacherDashboardViewProps {
  modules: MaturaModule[];
  students: UserProfile[];
  onOpenStudent: (userId: string) => void;
}

const StudentCard: React.FC<{ student: UserProfile; summary: UserSummary; modulesCount: number; onOpen: () => void }> = ({
  student,
  summary: s,
  modulesCount,
  onOpen,
}) => {
  const { t, uiLang } = useSettings();
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';
  return (
    <article className="grid gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <Avatar initials={student.initials} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl leading-7 font-semibold">{student.name}</h3>
          <p className="text-sm leading-5 text-ink-2">
            {t('dash.lastActivity')}: {formatRelative(s.lastActiveAt, t, locale)}
            {s.lastModule ? ` · ${s.lastModule.titlePl}` : ''}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onOpen}>
          {t('teacher.details')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <dl className="grid gap-3">
        <div className="grid gap-1">
          <div className="flex items-center justify-between text-sm leading-5">
            <dt className="text-ink-2">{t('dash.words')}</dt>
            <dd className="tabular-nums">
              <b className="font-semibold text-ink">{s.masteredWords}</b> / {s.totalWords} <span className="text-ink-2">({s.wordsPct}%)</span>
            </dd>
          </div>
          <Meter value={s.wordsPct} tone="success" label={`${t('dash.words')}: ${student.name}`} />
        </div>
        <div className="grid gap-1">
          <div className="flex items-center justify-between text-sm leading-5">
            <dt className="text-ink-2">{t('teacher.grammarPassed', { p: GRAMMAR_PASS_SCORE })}</dt>
            <dd className="tabular-nums">
              <b className="font-semibold text-ink">{s.grammarPassed}</b> / {modulesCount} {t('dash.topics')}
            </dd>
          </div>
          <Meter value={(s.grammarPassed / modulesCount) * 100} tone="success" label={`${t('dash.grammar')}: ${student.name}`} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-5 text-ink-2">
          <span>
            {t('teacher.testsStarted')}: <b className="font-semibold text-ink">{s.grammarStarted}</b>
          </span>
          <span>
            {t('teacher.toImprove')}: <b className="font-semibold text-ink">{s.grammarStarted - s.grammarPassed}</b>
          </span>
          <span>
            {t('teacher.review')}: <b className="font-semibold text-ink">{s.reviewWords}</b>
          </span>
        </div>
      </dl>
    </article>
  );
};

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ modules, students, onOpenStudent }) => {
  const { allStates } = useProgress();
  const { t } = useSettings();
  const summaries = students.map((st) => ({ student: st, summary: summarizeUser(modules, allStates[st.id]) }));
  const cols = `minmax(0,1.4fr) repeat(${students.length}, minmax(0,1fr))`;
  const attemptsLabel = (n: number) => (n === 1 ? t('dash.attempt', { n }) : t('dash.attempts', { n }));

  return (
    <div className="grid gap-8">
      <div className="-mx-4 -mt-4 bg-hero px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <p className="text-sm text-ink-2">{t('dash.subtitle')}</p>
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl leading-10 font-semibold sm:text-4xl sm:leading-12">{t('teacher.title')}</h1>
        </div>
        <p className="mt-2 max-w-[72ch] text-base leading-6 text-ink-2">{t('teacher.intro', { n: students.length, p: GRAMMAR_PASS_SCORE })}</p>
      </div>

      <section className="grid gap-4">
        <SectionTitle title={t('teacher.students')} description={t('teacher.studentsDesc')} />
        <div className="grid gap-4 lg:grid-cols-2">
          {summaries.map(({ student, summary }) => (
            <StudentCard key={student.id} student={student} summary={summary} modulesCount={modules.length} onOpen={() => onOpenStudent(student.id)} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <SectionTitle title={t('teacher.compare')} description={t('teacher.compareDesc')} />
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <div className="min-w-[640px]">
            <div className="grid gap-4 border-b border-line-soft px-5 py-3 text-sm leading-5 text-ink-2" style={{ gridTemplateColumns: cols }}>
              <span>{t('dash.colTopic')}</span>
              {students.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onOpenStudent(st.id)}
                  className="flex cursor-pointer items-center gap-2 text-left font-semibold text-ink hover:text-primary hover:underline"
                >
                  <Avatar initials={st.initials} size="sm" />
                  {st.name}
                </button>
              ))}
            </div>

            {modules.map((m, idx) => (
              <div key={m.id} className="grid gap-4 border-b border-line-soft px-5 py-4 last:border-b-0" style={{ gridTemplateColumns: cols }}>
                <div className="min-w-0">
                  <p className="text-base leading-6 font-semibold text-ink">
                    {m.number}. {m.titlePl}
                  </p>
                  <p className="truncate text-sm leading-5 text-ink-2" title={m.grammarSummary}>
                    {m.grammarSummary}
                  </p>
                </div>
                {summaries.map(({ student, summary }) => {
                  const r = summary.rows[idx];
                  return (
                    <div key={student.id} className="grid content-start gap-1.5">
                      <div className="flex items-center justify-between text-sm leading-5">
                        <span className="tabular-nums text-ink">
                          <b className="font-semibold">{r.mastered}</b> / {r.total} {t('teacher.words')}
                        </span>
                        <span className="text-ink-2">{Math.round(r.wordsPct)}%</span>
                      </div>
                      <Meter value={r.wordsPct} tone={r.mastered === r.total && r.total > 0 ? 'success' : 'primary'} label={`${student.name}: ${m.titlePl}`} />
                      <div className="flex items-center gap-2">
                        <GrammarStatusChip best={r.best} />
                        {r.attempts > 0 && <span className="text-xs leading-4 text-ink-2">{attemptsLabel(r.attempts)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
