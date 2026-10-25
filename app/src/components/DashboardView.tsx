import React from 'react';
import { BookOpenCheck, ChevronRight, ClipboardCheck, Layers, Play, RotateCcw } from 'lucide-react';
import type { MaturaModule, SectionType } from '../types';
import type { UserProfile } from '../users';
import { Button, Meter, SectionTitle, StatTile } from './ui';
import { Avatar, GrammarStatusChip } from './GrammarStatusChip';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { GRAMMAR_PASS_SCORE } from '../progress-context';
import { formatRelative, summarizeUser } from '../progressSummary';

interface DashboardViewProps {
  modules: MaturaModule[];
  /** Whose progress is shown. */
  user: UserProfile;
  /** True when a teacher is looking at a learner's page. */
  teacherView?: boolean;
  onOpen: (moduleId: string, section: SectionType) => void;
  onBackToClass?: () => void;
}

const gridCols = 'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_auto]';

export const DashboardView: React.FC<DashboardViewProps> = ({ modules, user, teacherView = false, onOpen, onBackToClass }) => {
  const { allStates, resetUser } = useProgress();
  const { t, uiLang } = useSettings();
  const s = summarizeUser(modules, allStates[user.id]);
  const anyProgress = s.startedModules > 0;
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';

  const nextModule = s.lastModule ?? s.rows.find((r) => r.grammar !== 'passed' || r.mastered < r.total)?.module ?? modules[0];

  const handleReset = () => {
    const msg = teacherView ? t('dash.resetConfirmStudent', { name: user.name }) : t('dash.resetConfirmMine');
    if (window.confirm(msg)) resetUser(user.id);
  };

  const attemptsLabel = (n: number) => (n === 1 ? t('dash.attempt', { n }) : t('dash.attempts', { n }));

  return (
    <div className="grid gap-8">
      <div className="-mx-4 -mt-4 bg-hero px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        {teacherView ? (
          <nav className="mb-2 flex items-center gap-1.5 text-sm text-ink-2" aria-label={t('misc.path')}>
            <button type="button" onClick={onBackToClass} className="cursor-pointer hover:text-primary hover:underline">
              {t('teacher.title')}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-ink">{user.name}</span>
          </nav>
        ) : (
          <p className="text-sm text-ink-2">{t('dash.subtitle')}</p>
        )}
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} size="lg" />
          <h1 className="text-3xl leading-10 font-semibold sm:text-4xl sm:leading-12">
            {teacherView ? `${t('dash.titleFor')}: ${user.name}` : `${t('dash.title')}, ${user.name}`}
          </h1>
        </div>
        <p className="mt-2 max-w-[72ch] text-base leading-6 text-ink-2">{t('dash.rules', { n: GRAMMAR_PASS_SCORE })}</p>
        <p className="mt-1 text-sm leading-5 text-ink-2">
          {t('dash.lastActivity')}: <b className="font-semibold text-ink">{formatRelative(s.lastActiveAt, t, locale)}</b>
          {s.lastModule && (
            <>
              {' '}· {t('dash.lastModule')}: <b className="font-semibold text-ink">{s.lastModule.titlePl}</b>
            </>
          )}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!teacherView && (
            <Button onClick={() => onOpen(nextModule.id, 'fiszki')}>
              <Play className="h-4 w-4" />
              {s.lastModule ? `${t('dash.continue')}: ${s.lastModule.titlePl}` : `${t('dash.start')}: ${nextModule.titlePl}`}
            </Button>
          )}
          {anyProgress && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              {t('dash.reset')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<Layers className="h-4 w-4" />}
          label={t('dash.words')}
          value={
            <>
              {s.masteredWords} <span className="text-base font-normal text-ink-2">/ {s.totalWords}</span>
            </>
          }
          hint={<Meter value={s.wordsPct} tone="success" label={t('dash.words')} className="mt-1" />}
        />
        <StatTile
          icon={<BookOpenCheck className="h-4 w-4" />}
          label={t('dash.grammar')}
          value={
            <>
              {s.grammarPassed}{' '}
              <span className="text-base font-normal text-ink-2">
                / {modules.length} {t('dash.topics')}
              </span>
            </>
          }
          hint={<Meter value={(s.grammarPassed / modules.length) * 100} tone="success" label={t('dash.grammar')} className="mt-1" />}
        />
        <StatTile
          icon={<ClipboardCheck className="h-4 w-4" />}
          label={t('dash.testsStarted')}
          value={
            <>
              {s.grammarStarted} <span className="text-base font-normal text-ink-2">/ {modules.length}</span>
            </>
          }
          hint={
            s.grammarStarted > s.grammarPassed
              ? t('dash.toImprove', { n: s.grammarStarted - s.grammarPassed, p: GRAMMAR_PASS_SCORE })
              : t('dash.repeatable')
          }
        />
        <StatTile
          icon={<RotateCcw className="h-4 w-4" />}
          label={t('dash.review')}
          value={s.reviewWords}
          hint={s.reviewWords > 0 ? t('dash.reviewHint') : t('dash.noReview')}
        />
      </div>

      <section className="grid gap-4">
        <SectionTitle title={t('dash.topicsTitle')} description={t('dash.topicsDesc')} />

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className={`hidden gap-4 border-b border-line-soft px-5 py-3 text-sm leading-5 text-ink-2 md:grid ${gridCols}`}>
            <span>{t('dash.colTopic')}</span>
            <span>{t('dash.colWords')}</span>
            <span>{t('dash.colGrammar')}</span>
            <span className="sr-only">Actions</span>
          </div>

          {s.rows.map(({ module: m, total, mastered, best, attempts, wordsPct: pct }) => (
            <div key={m.id} className={`grid gap-3 border-b border-line-soft px-5 py-4 last:border-b-0 md:items-center md:gap-4 ${gridCols}`}>
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => onOpen(m.id, 'fiszki')}
                  className="cursor-pointer text-left text-base leading-6 font-semibold text-ink hover:text-primary hover:underline"
                >
                  {m.number}. {m.titlePl}
                </button>
                <p className="truncate text-sm leading-5 text-ink-2" title={m.grammarSummary}>
                  {m.grammarSummary}
                </p>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between text-sm leading-5">
                  <span className="text-ink-2 md:sr-only">{t('dash.colWords')}</span>
                  <span className="tabular-nums text-ink">
                    <b className="font-semibold">{mastered}</b> / {total}
                    <span className="ml-1 text-ink-2">({Math.round(pct)}%)</span>
                  </span>
                </div>
                <Meter value={pct} tone={mastered === total && total > 0 ? 'success' : 'primary'} label={`${t('dash.colWords')}: ${m.titlePl}`} />
              </div>

              <div className="flex items-center justify-between gap-2 md:flex-col md:items-start md:gap-1">
                <span className="text-sm leading-5 text-ink-2 md:sr-only">{t('dash.colGrammar')}</span>
                <GrammarStatusChip best={best} />
                {attempts > 0 && <span className="text-xs leading-4 text-ink-2">{attemptsLabel(attempts)}</span>}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onOpen(m.id, 'fiszki')}>
                  {t('dash.openFlashcards')}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onOpen(m.id, 'gramatyka')}>
                  {t('dash.openGrammar')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
