import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SectionTitle } from './ui';
import { useSettings } from '../useSettings';
import { EXERCISE_PASS_SCORE } from '../progress-context';
import { formatRelative, type ModuleSummary, type ModuleWork, type WorkAnswer } from '../progressSummary';

/** One line for a table cell: which tasks of the module have saved work. */
export const WorkLine: React.FC<{ work: ModuleWork }> = ({ work }) => {
  const { t } = useSettings();
  if (work.count === 0) return null;
  const parts = [
    work.test && `${t('work.test')}: ${work.test.correct} / ${work.test.total}`,
    work.exercises.length > 0 && `${t('work.exercises')}: ${work.exercises.length}`,
    work.languageUse.length > 0 && `${t('work.srodki')}: ${work.languageUse.length}`,
    work.notes.length > 0 && `${t('work.notes')}: ${work.notes.length}`,
    work.essay && `${t('work.essay')}: ${t('work.words', { n: work.essay.words })}`,
  ].filter(Boolean);
  return <p className="text-xs leading-4 text-ink-2">{parts.join(' · ')}</p>;
};

const Answers: React.FC<{ answers: WorkAnswer[] }> = ({ answers }) => {
  const { t } = useSettings();
  return (
    <ol className="mt-2 grid gap-2">
      {answers.map((a, i) => (
        <li key={i} className="grid grid-cols-[auto_1fr] gap-x-2 text-sm leading-5">
          {a.correct === undefined ? (
            <span className="h-4 w-4" />
          ) : a.correct ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" aria-label={t('work.correct')} />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 text-error" aria-label={t('work.wrong')} />
          )}
          <div className="min-w-0">
            <p className="whitespace-pre-line text-ink-2">{a.label}</p>
            <p className="font-semibold text-ink">{a.answer}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

/** A task with its result on the summary line; the learner's own text opens underneath. */
const Task: React.FC<{ title: string; result: string; children?: React.ReactNode }> = ({ title, result, children }) => (
  <details className="border-t border-line-soft py-3">
    <summary className="cursor-pointer text-sm leading-5 text-ink hover:text-primary">
      <span className="font-semibold">{title}</span>
      {result && <span className="text-ink-2"> · {result}</span>}
    </summary>
    {children}
  </details>
);

/** What a learner actually did in each module: answers, notes and essays, not only the scores. */
export const CompletedTasks: React.FC<{ rows: ModuleSummary[]; teacherView: boolean }> = ({ rows, teacherView }) => {
  const { t, uiLang } = useSettings();
  const locale = uiLang === 'en' ? 'en-GB' : 'pl-PL';
  const withWork = rows.filter((r) => r.work.count > 0);

  return (
    <section className="grid gap-4">
      <SectionTitle title={t('work.title')} description={teacherView ? t('work.descTeacher') : t('work.desc')} />

      {withWork.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface px-5 py-4 text-sm leading-5 text-ink-2">{t('work.empty')}</p>
      ) : (
        <div className="grid gap-4">
          {withWork.map(({ module: m, work, exercisesPassed, exercisesTotal }) => (
            <article key={m.id} className="rounded-2xl border border-line bg-surface px-5 pt-4 pb-1">
              <h3 className="pb-3 text-base leading-6 font-semibold text-ink">
                {m.number}. {m.titlePl}
              </h3>

              {work.test && (
                <Task
                  title={t('work.test')}
                  result={t('work.testLine', { a: work.test.answered, n: work.test.total, c: work.test.checked, k: work.test.correct })}
                >
                  <Answers answers={work.test.answers} />
                </Task>
              )}

              {work.exercises.map((e) => (
                <Task
                  key={e.id}
                  title={`${t('work.exercises')}: ${e.title}`}
                  result={[e.best !== undefined ? t('work.best', { k: e.best, n: e.total }) : t('work.unchecked'), e.revealed ? t('work.revealed') : '']
                    .filter(Boolean)
                    .join(', ')}
                >
                  <Answers answers={e.answers} />
                </Task>
              ))}

              {work.languageUse.length > 0 && (
                <Task title={t('work.srodki')} result={t('work.srodkiLine', { k: exercisesPassed, n: exercisesTotal })}>
                  <ul className="mt-2 grid gap-2">
                    {work.languageUse.map((e) => (
                      <li key={e.id} className="grid grid-cols-[auto_1fr] gap-x-2 text-sm leading-5">
                        {e.best >= EXERCISE_PASS_SCORE ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" aria-label={t('srodki.passed')} /> : <span className="h-4 w-4" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">
                            {e.functionLabel} <span className="font-normal text-ink-2">· {t(`srodki.type.${e.type}`)}</span>
                          </p>
                          <p className="text-ink-2">
                            {t('work.srodkiBest', { p: e.best })} · {e.attempts === 1 ? t('dash.attempt', { n: e.attempts }) : t('dash.attempts', { n: e.attempts })} · {formatRelative(e.lastAt, t, locale)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Task>
              )}

              {work.notes.length > 0 && (
                <Task title={t('work.notes')} result={String(work.notes.length)}>
                  <div className="mt-2 grid gap-2">
                    {work.notes.map((n) => (
                      <div key={n.question} className="text-sm leading-5">
                        <p className="text-ink-2">{n.question}</p>
                        <p className="whitespace-pre-wrap text-ink">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </Task>
              )}

              {work.essay && (
                <Task
                  title={`${t('work.essay')}: ${work.essay.title}`}
                  result={`${t('work.words', { n: work.essay.words })} · ${formatRelative(work.essay.at, t, locale)}`}
                >
                  <p className="mt-2 max-w-[72ch] text-sm leading-6 whitespace-pre-wrap text-ink">{work.essay.text}</p>
                </Task>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
