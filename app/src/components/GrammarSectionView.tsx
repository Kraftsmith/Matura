import React, { useEffect } from 'react';
import type { GrammarRule, TestQuestion } from '../types';
import { AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import { Button, Chip } from './ui';
import { InteractiveTestView } from './InteractiveTestView';
import { useSettings } from '../useSettings';
import { pluralForm } from '../i18n';
import { useUser } from '../useUser';
import { buildHash } from '../userRoute';
import { CopyLinkButton } from './CopyLinkButton';

interface GrammarSectionViewProps {
  moduleId: string;
  /** A rule id or "test" from the address: the page opens scrolled to it. */
  focusId?: string;
  rules: GrammarRule[];
  questions: TestQuestion[];
  moduleTitle: string;
  onScoreSave?: (score: number) => void;
}

const ruleAnchor = (ruleId: string) => `rule-${ruleId}`;
const TEST_ANCHOR = 'grammar-test';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * One section for grammar: the rules of the module first, then the test that checks them.
 * Rules and tasks are linked both ways through grammarRef.ruleId.
 */
export const GrammarSectionView: React.FC<GrammarSectionViewProps> = ({ moduleId, focusId, rules, questions, moduleTitle, onScoreSave }) => {
  const { tr, t } = useSettings();
  const { user } = useUser();
  const sectionRoute = `${moduleId}/gramatyka`;

  // Every rule and the test have their own address (…/gramatyka/gram-2, …/gramatyka/test).
  useEffect(() => {
    if (focusId) document.getElementById(focusId === 'test' ? TEST_ANCHOR : ruleAnchor(focusId))?.scrollIntoView({ block: 'start' });
  }, [focusId]);

  const tasksPerRule = rules.reduce<Record<string, number>>((acc, r) => {
    acc[r.id] = questions.filter((q) => q.grammarRef?.ruleId === r.id).length;
    return acc;
  }, {});

  const levelLabel = (level: GrammarRule['level']) =>
    level === 'R' ? t('gram.levelR') : level === 'P' ? t('gram.levelP') : t('gram.levelPR');

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-4 py-6">
      <section className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-primary">{t('gram.kicker')}</span>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              {t('gram.title')}: {moduleTitle}
            </h2>
            <p className="mt-1 max-w-[72ch] text-sm text-ink-2">{t('gram.desc')}</p>
          </div>
          {questions.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => scrollTo(TEST_ANCHOR)}>
              <ArrowDown className="h-4 w-4" />
              {t('gram.goToTest')} ({questions.length})
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {rules.map((rule) => {
            const n = tasksPerRule[rule.id] ?? 0;
            return (
              <article key={rule.id} id={ruleAnchor(rule.id)} className="grid gap-4 scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <span className="text-sm text-ink-2">
                      {t('gram.level')}: {levelLabel(rule.level)}
                    </span>
                    <h3 className="text-lg font-semibold text-ink">
                      <a href={`#${buildHash(user.id, `${sectionRoute}/${rule.id}`)}`} className="hover:text-primary hover:underline">
                        {rule.title}
                      </a>
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CopyLinkButton rest={`${sectionRoute}/${rule.id}`} />
                    {n > 0 ? (
                      <button
                        type="button"
                        onClick={() => scrollTo(`task-group-${rule.id}`)}
                        className="cursor-pointer"
                        title={t('gram.showTasks')}
                      >
                        <Chip tone="primary" size="sm">
                          {n} {t(`plural.task${pluralForm(n)}`)} {t('gram.inTest')}
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Chip>
                      </button>
                    ) : null}
                  </div>
                </div>

                {rule.formula && (
                  <div className="rounded-lg border border-primary-tint bg-primary-tint/60 p-3.5 text-sm font-semibold text-primary-hover">
                    <span className="mb-0.5 block text-xs font-semibold text-primary">{t('gram.formula')}:</span>
                    {rule.formula}
                  </div>
                )}

                <p className="text-sm leading-relaxed text-ink sm:text-base">{rule.ruleSummary}</p>

                <div className="grid gap-2 pt-1">
                  <span className="block text-xs font-semibold text-ink-3">{t('gram.examples')}:</span>
                  {rule.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="rounded-lg border border-line-soft bg-hero p-3 text-sm">
                      <div className="mb-0.5 font-semibold text-ink">{ex.english}</div>
                      <div className="text-xs text-ink-2">{tr(ex.polish, ex.russian)}</div>
                      {ex.note && (
                        <div className="mt-1 text-xs font-medium text-primary">
                          {t('gram.note')}: {ex.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {rule.maturaTrap && (
                  <div className="flex items-start gap-3 rounded-lg border border-warning-tint bg-warning-tint p-3.5 text-xs text-warning">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <div>
                      <strong className="mb-0.5 block text-xs font-semibold text-warning">{t('gram.trap')}:</strong>
                      <span>{rule.maturaTrap}</span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {questions.length > 0 && (
        <section id={TEST_ANCHOR} className="grid gap-6 scroll-mt-20 border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-primary">{t('gram.testKicker')}</span>
              <h2 className="mt-1 text-2xl font-semibold text-ink">{t('gram.testTitle')}</h2>
              <p className="mt-1 max-w-[72ch] text-sm text-ink-2">{t('gram.testDesc')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyLinkButton rest={`${sectionRoute}/test`} variant="secondary" />
              <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <ArrowUp className="h-4 w-4" />
                {t('gram.backToRules')}
              </Button>
            </div>
          </div>
          <InteractiveTestView questions={questions} rules={rules} moduleTitle={moduleTitle} onScoreSave={onScoreSave} embedded />
        </section>
      )}
    </div>
  );
};
